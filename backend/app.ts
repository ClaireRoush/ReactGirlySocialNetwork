import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import socketIo from "socket.io";
import cookieParser from "cookie-parser";
import multer from "multer";
import "./types/types";
import path from "path";
import { ExpressPeerServer } from "peer";

import { register, login, logout } from "./controllers/AuthControllers";
import {
  post,
  postGet,
  getPostById,
  postCommentsById,
  postLikesById,
  deletePost,
  getPostByUser,
  deleteComment,
  getCommentsByPostId,
} from "./controllers/PostControllers";
import {
  me,
  profile,
  userProfileByUsername,
  userProfilePostsByUserId,
  changeInfo,
  changePost,
  settings,
  findUserAvatarByUser,
} from "./controllers/GetUserInfoControlles";
import {
  getMessagesByUser,
  postMessagesForWho,
  postContactsByUser,
  getContacts,
} from "./controllers/ChatControllers";
import { getNotifications } from "./controllers/NotificationControllers";

dotenv.config();
dotenv.config({ path: `.env.local`, override: true });
const API_URL = process.env.BASE_API_URL || "";

const uploadMiddleware = multer({
  dest: path.join(__dirname, "/uploads/"),
});
const uploadAvatarMiddleware = multer({
  dest: path.join(__dirname, "/uploads/userAvatars/"),
});

const secret = process.env.JWT_SECRET;
const app = express();

const http = require("http");
const server = http.createServer(app);

const io = new socketIo.Server(server, {
  cors: {
    origin: process.env.CORS_ORIGINS.split(" ") || "http://localhost",
  },
});

io.on("connection", (socket) => {
  const userRooms = [];

  const getRoomName = (username1: string, username2: string): string => {
    return [username1, username2].sort().join("");
  };

  socket.on("joinRooms", (rooms) => {
    rooms.forEach((room: any) => {
      const roomName = getRoomName(room.username, room.me);
      socket.join(roomName);
      userRooms.push(roomName);
    });
  });

  socket.on("sendMessage", (msg) => {
    const roomName = getRoomName(msg.user.username, msg.forWho.username);

    io.to(roomName).emit("receiveMessage", msg);
  });

  socket.on("leave room", (room) => {
    socket.leave(room);
    console.log(`User left room: ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const peerServer = ExpressPeerServer(server, {
  path: "/peerjs",
});

app.use("/peerjs", peerServer);

app.use(
  cors({
    credentials: true,
    origin: process.env.CORS_ORIGINS.split(" ") || "http://localhost",
    methods: ["GET", "POST", "OPTIONS", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URL);

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

const optionalAuthenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token != null) {
    jwt.verify(token, secret, (err, user) => {
      if (err) return;
      req.user = user as { id: string; username: string };
    });
  }
  next();
};

app.post(API_URL + "/register", register);
app.post(API_URL + "/login", login);
app.post(API_URL + "/logout", logout);
app.get(API_URL + "/profile", authenticateToken, profile);
app.get(API_URL + "/me", authenticateToken, me);
app.get(API_URL + "/changeInfo", authenticateToken, changeInfo);
app.post(
  API_URL + "/settings",
  authenticateToken,
  uploadAvatarMiddleware.single("file"),
  settings
);

app.post(
  API_URL + "/post",
  uploadMiddleware.single("file"),
  authenticateToken,
  post
);

app.get(API_URL + "/post", optionalAuthenticateToken, postGet);
app.get(API_URL + "/post/:user", optionalAuthenticateToken, getPostByUser);
app.get(API_URL + "/post/find/:id", getPostById);
app.get(API_URL + "/post/comments/:id", getCommentsByPostId);
app.post(API_URL + "/post/edit/:id", changePost);
app.get(API_URL + "/userProfile/:username", userProfileByUsername);
app.get(API_URL + "/userProfile/posts/:User", userProfilePostsByUserId);
app.post(API_URL + "/post/likes/:id", authenticateToken, postLikesById);
app.post(API_URL + "/post/comments/:id", authenticateToken, postCommentsById);
app.delete(API_URL + "/post/:id", authenticateToken, deletePost);
app.delete(API_URL + "/post/comments/:id", authenticateToken, deleteComment);
app.post(API_URL + "/messages/:forWho", authenticateToken, postMessagesForWho);
app.get(API_URL + "/messages/:user", authenticateToken, getMessagesByUser);
app.post(
  API_URL + "/addToContacts/:user",
  authenticateToken,
  postContactsByUser
);

app.get(API_URL + "/findUserAvatar/:User", findUserAvatarByUser);

app.get(API_URL + "/getContacts", authenticateToken, getContacts);

app.get(API_URL + "/notifications", authenticateToken, getNotifications);

io.on;

if ((process.env.RUNNING_LOCALLY = "1")) {
  app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
}

server.listen(process.env.PORT, () => {
  console.log("Meeeeow");
});
