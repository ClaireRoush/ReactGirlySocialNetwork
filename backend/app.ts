// TODO: pls replace all "(req as any)" with something smarter

import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import socketIo from "socket.io";
import cookieParser from "cookie-parser";
import multer from "multer";

import User from "./models/User";
import Post from "./models/Post";
import Likes from "./models/Likes";
import "./types/types";
import Comments from "./models/Comments";
import Messages from "./models/Messages";
import Notifications from "./models/Notifications";
import { register, login } from "./controllers/AuthControllers";

dotenv.config();
dotenv.config({ path: `.env.local`, override: true });

const uploadMiddleware = multer({ dest: "uploads/" });
const secret = process.env.JWT_SECRET;
const salt = bcrypt.genSaltSync(10);
const app = express();
const router = express.Router();

const http = require("http");
const server = http.createServer(app);

const API_URL = process.env.BASE_API_URL || "";

const socket_args = process.env.RUNNING_LOCALY == "1" ? {} : {
  cors: {
    origin: process.env.CORS_ORIGINS.split(" ") || "http://localhost",
  },
}

const io = new socketIo.Server(server, socket_args);

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

if (process.env.RUNNING_LOCALY == "1") // yep :)
{
  app.use(
    cors({
      credentials: true,
      origin: process.env.CORS_ORIGINS.split(" ") || "http://localhost",
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Authorization", "Content-Type"]
    })
  );
}

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

mongoose.connect(process.env.MONGO_URL);

app.get(API_URL + "/", (req: Request, res: Response) => {
  res.json("Vse rabotaet, privetiki!!!11");
});

app.post(API_URL + "/register", register);
app.post(API_URL + "/login", login);

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user as { id: string; username: string };
    next();
  });
};

app.get(API_URL + "/profile", authenticateToken, (req: Request, res: Response) => {
  res.json((req as any).user);
});

app.get(API_URL + "/me", authenticateToken, async (req: Request, res: Response) => {
  let userId = req.user.id;
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

app.post(API_URL + "/logout", (req: Request, res: Response) => {
  res.json("ok");
});

app.post(
  API_URL + "/post",
  uploadMiddleware.single("file"),
  authenticateToken,
  async (req: Request, res: Response) => {
    const { title, summary, content, image } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      image,
      author: (req as any).user.id,
    });
    res.json({ postDoc });
  }
);

app.get(API_URL + "/post", async (req: Request, res: Response) => {
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(30)
  );
});

app.get(API_URL + "/post/:id", async (req: Request, res: Response) => {
  let id = req.params.id;
  const postId = await Post.findById(id);
  res.json(postId);
});

app.get(API_URL + "/userProfile/:username", async (req: Request, res: Response) => {
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

app.get(API_URL + "/userProfile/posts/:User", async (req: Request, res: Response) => {
  const username = req.params.User;
  const user = await User.findOne({ username: username });
  res.json(
    await Post.find({ author: user._id })
      .populate("author", "username")
      .sort({ createdAt: -1 })
  );
});

app.post(API_URL + "/post/likes/:id", authenticateToken, async (req: Request, res: Response) => {
  const username = (req as any).user.username;
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

app.post(API_URL + "/messages/:forWho", authenticateToken, async (req: Request, res: Response) => {
  const username = (req as any).user.username;
  const forWhoRecieve = req.params.forWho;
  const message = req.body.message;

  try {
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


app.get(API_URL + "/messages/:user", authenticateToken, async (req: Request, res: Response) => {
  const currentUsername = (req as any).user.username;
  const targetUsername = req.params.user;

  const currentUserDoc = await User.findOne({ username: currentUsername });
  const targetUserDoc = await User.findOne({ username: targetUsername });

  if (!currentUserDoc || !targetUserDoc) {
    return res.status(404).json({ message: "User not found" });
  }

  const currentUserId = currentUserDoc._id;
  const targetUserId = targetUserDoc._id;

  const messages = await Messages.find({
    $or: [
      { user: currentUserId, forWho: targetUserId },
      { user: targetUserId, forWho: currentUserId },
    ],
  })
    .populate("user", "username")
    .populate("forWho", "username")
    .sort({ createdAt: 1 });

  res.json(messages);
});

/* app.get(API_URL + "/checkAviableContacts", authenticateToken, async (req: Request, res: Response) => {
  const username = (req as any).user.username;
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

app.post(API_URL + "/addToContacts/:user", authenticateToken, async (req: Request, res: Response) => {
  const user = req.params.user;
  const me = (req as any).user.username;

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

app.get(API_URL + "/getContacts", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const userInfo = await User.findById(userId);

    const contactUsernames = userInfo.contacts;

    const contactsInfo = await Promise.all(
      contactUsernames.map(async (username: string) => {
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

app.get(API_URL + "/post/likes/:id", async (req: Request, res: Response) => {
  const likedPost = req.params.id;
  const likeCount = await Likes.countDocuments({ likedPost: likedPost });
  res.json({ likeCount });
});

app.post(API_URL + "/post/comments/:id", authenticateToken, async (req: Request, res: Response) => {
  const commentedOn = req.params.id;
  const username = (req as any).user.username;
  const { text } = req.body;

  const post = await Post.findById(commentedOn).populate("author");
  const postAuthor = post.author;

  const user = await User.findOne({ username: username });

  let postDoc = await Comments.create({
    user,
    text,
    commentedOn,
  });

  let postNotificationDoc = await Notifications.create({
    whoIsPost: user,
    commentedOn: commentedOn,
    userId: postAuthor._id,
    userAvatar: user.userAvatar,
  });
  res.json(commentedOn);
});

app.get(API_URL + "/post/comments/:id", async (req: Request, res: Response) => {
  const mainPostId = req.params.id;
  let meowComments = await Comments.find({ commentedOn: mainPostId }).populate(
    "user",
    "username userAvatar"
  );
  res.json(meowComments);
});

app.get(API_URL + "/notifications", authenticateToken, async (req: Request, res: Response) => {
  let userId = (req as any).user.id;
  const myNotifications = await Notifications.find({ userId: userId });

  // TODO: replace notification type with actual type
  const getAllData = myNotifications.map((notification: any) => ({
    likedOn: notification.likedOn,
    commentedOn: notification.commentedOn,
    whoIsPost: notification.whoIsPost,
    isRead: notification.isRead,
    userAvatar: notification.userAvatar,
  }));

  const whoIsPostIds = [
    ...new Set(getAllData.map((notification: any) => notification.whoIsPost)),
  ];

  const users = await User.find({ _id: { $in: whoIsPostIds } }).lean();

  const userMap = users.reduce((acc: any, user: any) => {
    acc[user._id] = user.username;
    return acc;
  }, {});

  const notificationsWithUsernames = getAllData.map((notification: any) => ({
    ...notification,
    whoIsPost: userMap[notification.whoIsPost] || notification.whoIsPost,
  }));

  res.json(notificationsWithUsernames);
});

app.get(API_URL + "/changeInfo", authenticateToken, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const user = await User.findOne({ _id: userId });
  res.json(user);
});

app.post(API_URL + "/settings", authenticateToken, async (req: Request, res: Response) => {
  const updateInfo = {
    userAvatar: req.body.userAvatar,
    userDesc: req.body.userDesc,
    username: req.body.username,
    pronouns: req.body.pronouns,
    profileHashColor: req.body.profileHashColor,
  }

  const userId = (req as any).user.id;
  const user = await User.findOneAndUpdate(
    { _id: userId },
    updateInfo,
    { new: true }
  );
  res.json(user);
});

app.post(API_URL + "/isMyPost/:id", authenticateToken, async (req: Request, res: Response) => {
  const postId = req.params.id;
  const userId = (req as any).user.id;
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

app.post(API_URL + "/deletePost/:id", authenticateToken, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const postId = req.params.id;
  const postDoc = await Post.findOneAndDelete({ _id: postId });
  const authorCheck = postDoc.author._id.toString() === userId;

  if (authorCheck) {
    res.json(authorCheck);
  } else {
    res.status(404).json({ message: "You are so silly!!!!" });
  }
});

app.get(API_URL + "/findUserAvatar/:User", async (req: Request, res: Response) => {
  const user = req.params.User;
  const postDoc = await User.findOne({ username: user });
  try {
    res.json(postDoc.userAvatar);
  } catch (error) {
    res.status(404).json({ message: "Avatar not find!!!" });
  }
});

app.get(API_URL + "/checkIfLiked/:Id", authenticateToken, async (req: Request, res: Response) => {
  const postId = req.params.Id;
  const userId = (req as any).user.id;
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

server.listen(process.env.PORT, () => {
  console.log("Meeeeow");
});
