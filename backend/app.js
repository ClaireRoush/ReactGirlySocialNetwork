require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const User = require("./models/User");
const Post = require("./models/Post");
const Likes = require("./models/Likes");
const Comments = require("./models/Comments");
const Messages = require("./models/Messages");
const Notifications = require("./models/Notifications");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const secret = process.env.JWT_SECRET;
const salt = bcrypt.genSaltSync(10);
const fs = require("fs");
const router = express.Router();

const io = require("socket.io")(7272, {
  cors: {
    origin: ["https://reactgirlysocialnetwork.onrender.com"],
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("join room", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("leave room", (room) => {
    socket.leave(room);
    console.log(`User left room: ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("chat message", (msg) => {
    const { room, message } = msg;
    socket.to(room).emit("chat message", message); // Отправляем сообщение всем в комнате, включая отправителя
  });
});

/* 
Я обещаю, что перепишу всё на более читабельный вид
без 1000+ запросов за один пост... 
наверное...
*/

app.use(
  cors({
    credentials: true,
    origin: "https://reactgirlysocialnetwork.onrender.com",
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

mongoose.connect(process.env.MONGO_URL);

app.get("/", (req, res) => {
  res.json("Vse rabotaet, privetiki!!!11");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.json({
        id: userDoc._id,
        username,
        token,
      });
    });
  } else {
    res.status(400).json("Wrong!!!");
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get("/profile", authenticateToken, (req, res) => {
  res.json(req.user);
});

app.get("/me", authenticateToken, async (req, res) => {
  userId = req.user.id;
  const getUserInfo = await User.findById(userId);
  const data = {
    username: getUserInfo.username,
    userAvatar: getUserInfo.userAvatar,
    userDesc: getUserInfo.userDesc,
    pronouns: getUserInfo.pronouns,
    profileHashColor: getUserInfo.profileHashColor,
  };
  res.json(data);
});

app.post("/logout", (req, res) => {
  res.json("ok");
});

app.post(
  "/post",
  uploadMiddleware.single("file"),
  authenticateToken,
  async (req, res) => {
    const { title, summary, content, image } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      image,
      author: req.user.id,
    });
    res.json({ postDoc });
  }
);

app.get("/post", async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(30)
  );
});

app.get("/post/:id", async (req, res) => {
  id = req.params.id;
  const postId = await Post.findById(id);
  res.json(postId);
});

app.get("/userProfile/:username", async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) {
    return res.status(404).json({ message: "Ты дурашка та ещё!!!" });
  }
  res.json({
    username: user.username,
    userAvatar: user.userAvatar,
    userDesc: user.userDesc,
    pronouns: user.pronouns,
    profileHashColor: user.profileHashColor,
  });
});

app.get("/userProfile/posts/:User", async (req, res) => {
  const username = req.params.User;
  const user = await User.findOne({ username: username });
  res.json(
    await Post.find({ author: user._id })
      .populate("author", "username")
      .sort({ createdAt: -1 })
  );
});

app.post("/post/likes/:id", authenticateToken, async (req, res) => {
  const username = req.user.username;
  const likedPostId = req.params.id;
  const user = await User.findOne({ username: username });
  const post = await Post.findById(likedPostId);

  const existingLike = await Likes.findOne({
    user: user._id,
    likedPost: post._id,
  });

  if (existingLike) {
    await Likes.deleteOne({ _id: existingLike._id });
  } else {
    await Likes.create({
      user: user,
      likedPost: post,
    });
  }

  const likeCount = await Likes.countDocuments({ likedPost: post._id });
  res.json({ likeCount });
});

app.post("/messages/:forWho", authenticateToken, async (req, res) => {
  const username = req.user.username; // текущий пользователь
  const forWhoRecieve = req.params.forWho; // пользователь, которому отправляется сообщение
  const message = req.body.message; // текст сообщения

  try {
    // Получаем документы пользователей
    const user = await User.findOne({ username: username });
    const forWho = await User.findOne({ username: forWhoRecieve });

    if (!user || !forWho) {
      return res.status(404).json({ message: "User not found" });
    }

    const messageDoc = await Messages.create({
      user: user._id,
      forWho: forWho._id,
      message: message,
      userAvatar: user.userAvatar,
    });

    const populatedMessageDoc = await Messages.findById(messageDoc._id)
      .populate("user", "username")
      .populate("forWho", "username")
      .exec();

    res.json(populatedMessageDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/messages/:user", authenticateToken, async (req, res) => {
  const currentUsername = req.user.username;
  const targetUsername = req.params.user;

  // Получаем документы пользователей
  const currentUserDoc = await User.findOne({ username: currentUsername });
  const targetUserDoc = await User.findOne({ username: targetUsername });

  if (!currentUserDoc || !targetUserDoc) {
    return res.status(404).json({ message: "User not found" });
  }

  const currentUserId = currentUserDoc._id;
  const targetUserId = targetUserDoc._id;

  // Находим сообщения, где текущий пользователь отправитель или получатель
  const messages = await Messages.find({
    $or: [
      { user: currentUserId, forWho: targetUserId }, // Сообщения отправленные текущим пользователем
      { user: targetUserId, forWho: currentUserId }, // Сообщения отправленные targetUser-ом
    ],
  })
    .populate("user", "username") // Подставляем username отправителя
    .populate("forWho", "username") // Подставляем username получателя
    .sort({ createdAt: 1 }); // Сортировка по дате создания, по возрастанию

  res.json(messages);
});

/* app.get("/checkAviableContacts", authenticateToken, async (req, res) => {
  const username = req.user.username;
  const grabUser = await User.findOne({ username: username });
  const userId = grabUser.id;

  const messages = await Messages.find({ forWho: userId }).select("user");
  const uniqueSenderIds = [
    ...new Set(messages.map((message) => message.user.toString())),
  ];
  const contacts = await User.find({ _id: { $in: uniqueSenderIds } });

  const contactsMainInfo = contacts.map((contact) => ({
    username: contact.username,
    userAvatar: contact.userAvatar,
  }));

  res.json(contactsMainInfo);
}); */

app.post("/addToContacts/:user", authenticateToken, async (req, res) => {
  const user = req.params.user;
  const me = req.user.username;

  const addToContacts = await User.findOneAndUpdate(
    { username: me },
    { $pull: { contacts: user } }
  );

  const updatedUser = await User.findOneAndUpdate(
    { username: me },
    { $push: { contacts: { $each: [user], $position: 0 } } },
    { new: true }
  );

  res.json(updatedUser);
});

app.get("/getContacts", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userInfo = await User.findById(userId);

    const contactUsernames = userInfo.contacts;

    const contactsInfo = await Promise.all(
      contactUsernames.map(async (username) => {
        const contact = await User.findOne({ username }, "username userAvatar");

        if (!contact) {
          return { username, userAvatar: null };
        }

        return {
          username: contact.username,
          userAvatar: contact.userAvatar,
        };
      })
    );

    res.json(contactsInfo);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/post/likes/:id", async (req, res) => {
  const likedPost = req.params.id;
  const likeCount = await Likes.countDocuments({ likedPost: likedPost });
  res.json({ likeCount });
});

app.post("/post/comments/:id", authenticateToken, async (req, res) => {
  const commentedOn = req.params.id;
  const username = req.user.username;
  const { text } = req.body;

  const post = await Post.findById(commentedOn).populate("author");
  const postAuthor = post.author;

  const user = await User.findOne({ username: username });

  postDoc = await Comments.create({
    user,
    text,
    commentedOn,
  });

  postNotificationDoc = await Notifications.create({
    whoIsPost: user,
    commentedOn: commentedOn,
    userId: postAuthor._id,
    userAvatar: user.userAvatar,
  });
  res.json(commentedOn);
});

app.get("/post/comments/:id", async (req, res) => {
  const mainPostId = req.params.id;
  meowComments = await Comments.find({ commentedOn: mainPostId }).populate(
    "user",
    "username userAvatar"
  );
  res.json(meowComments);
});

app.get("/notifications", authenticateToken, async (req, res) => {
  userId = req.user.id;
  const myNotifications = await Notifications.find({ userId: userId });

  const getAllData = myNotifications.map((notification) => ({
    likedOn: notification.likedOn,
    commentedOn: notification.commentedOn,
    whoIsPost: notification.whoIsPost,
    isRead: notification.isRead,
    userAvatar: notification.userAvatar,
  }));

  const whoIsPostIds = [
    ...new Set(getAllData.map((notification) => notification.whoIsPost)),
  ];

  const users = await User.find({ _id: { $in: whoIsPostIds } }).lean();

  const userMap = users.reduce((acc, user) => {
    acc[user._id] = user.username;
    return acc;
  }, {});

  const notificationsWithUsernames = getAllData.map((notification) => ({
    ...notification,
    whoIsPost: userMap[notification.whoIsPost] || notification.whoIsPost,
  }));

  res.json(notificationsWithUsernames);
});

app.get("/changeInfo", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const user = await User.findOne({ _id: userId });
  res.json(user);
});

app.post("/settings", authenticateToken, async (req, res) => {
  const userAvatar = req.body;
  const userDesc = req.body;
  const username = req.body;
  const pronouns = req.body;
  const profileHashColor = req.body;

  const userId = req.user.id;
  const user = await User.findOneAndUpdate(
    { _id: userId },
    userAvatar,
    {
      new: true,
    },
    userDesc,
    {
      new: true,
    },
    username,
    {
      new: true,
    },
    pronouns,
    {
      new: true,
    },
    profileHashColor,
    {
      new: true,
    }
  );
  res.json(user);
});

app.post("/isMyPost/:id", authenticateToken, async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const postDoc = await Post.findOne({ _id: postId }).populate(
    "author",
    "username"
  );
  const authorCheck = postDoc.author._id.toString() === userId;
  if (authorCheck) {
    res.json(authorCheck);
  } else {
    res.status(404).json({ message: "You are so silly!!!!" });
  }
});

app.post("/deletePost/:id", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;
  const postDoc = await Post.findOneAndDelete({ _id: postId });
  const authorCheck = postDoc.author._id.toString() === userId;

  if (authorCheck) {
    res.json(authorCheck);
  } else {
    res.status(404).json({ message: "You are so silly!!!!" });
  }
});

app.get("/findUserAvatar/:User", async (req, res) => {
  const user = req.params.User;
  const postDoc = await User.findOne({ username: user });
  try {
    res.json(postDoc.userAvatar);
  } catch (error) {
    res.status(404).json({ message: "Avatar not find!!!" });
  }
});

app.get("/checkIfLiked/:Id", authenticateToken, async (req, res) => {
  const postId = req.params.Id;
  const userId = req.user.id;
  const existingLike = await Likes.findOne({
    user: userId,
    likedPost: postId,
  });
  if (existingLike) {
    return res.json(true);
  }
  return res.json(false);
});

io.on;

app.listen(process.env.PORT, () => {
  console.log("Meeeeow");
});
