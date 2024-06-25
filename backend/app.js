require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const User = require("./models/User");
const Post = require("./models/Post");
const UserParams = require("./models/UserParams");
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
        token, // Send the token in the response body
      });
    });
  } else {
    res.status(400).json("Wrong!!!");
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

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

app.post("/logout", (req, res) => {
  // Clear the client-side token instead of server-side
  res.json("ok");
});

app.post("/post", uploadMiddleware.single("file"), authenticateToken, async (req, res) => {
  const { title, summary, content, image } = req.body;
  const postDoc = await Post.create({
    title,
    summary,
    content,
    image,
    author: req.user.id,
  });
  res.json({ postDoc });
});

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
  res.json({ username: user.username, userAvatar: user.userAvatar });
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

app.get("/changeInfo", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const user = await User.findOne({ _id: userId });
  res.json(user);
});

app.post("/settings", authenticateToken, async (req, res) => {
  const userAvatar = req.body;
  const userId = req.user.id;
  const user = await User.findOneAndUpdate({ _id: userId }, userAvatar, { new: true });
  res.json(user);
});

app.listen(process.env.PORT, () => {
  console.log("Meeeeow");
});
