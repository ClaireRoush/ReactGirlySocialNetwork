require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const User = require("./models/User");
const Post = require("./models/Post");
const Comments = require("./models/Comments");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const secret = process.env.JWT_SECRET;
const salt = bcrypt.genSaltSync(10);
const fs = require("fs");

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

app.post("/post/comments/:id", authenticateToken, async (req, res) => {
  const commentedOn = req.params.id;
  const username = req.user.username;
  const { text } = req.body;

  const user = await User.findOne({ username: username });

  postDoc = await Comments.create({
    user,
    text,
    commentedOn,
  });
  res.json(postDoc);
});

app.get("/post/comments/:id", async (req, res) => {
  const mainPostId = req.params.id;
  meowComments = await Comments.find({ commentedOn: mainPostId }).populate(
    "user",
    "username"
  );
  res.json(meowComments);
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

app.listen(process.env.PORT, () => {
  console.log("Meeeeow");
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
