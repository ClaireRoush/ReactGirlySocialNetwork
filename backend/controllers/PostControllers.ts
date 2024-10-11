import { Request, Response } from "express";
import sharp from "sharp";
import dotenv from "dotenv";
import Post from "../models/Post";
import User from "../models/User";
import Likes from "../models/Likes";
import Comments from "../models/Comments";
import Notifications from "../models/Notifications";
import fs from "fs";
import path from "path";

dotenv.config();

export const post = async (req: Request, res: Response) => {
  const { title, summary, content } = req.body;
  const postData = await Post.create({
    title,
    summary,
    content,
    author: req.user.id,
  });

  if (req.file) {
    const { originalname, path: tempPath } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = tempPath + "." + ext;
    const formatMap: { [key: string]: keyof sharp.FormatEnum } = {
      jpg: "jpeg",
      jpeg: "jpeg",
      png: "png",
      webp: "webp",
    };

    const format = formatMap[ext];

    await sharp(tempPath)
      .toFormat(format)
      .jpeg({ quality: 30 })
      .toFile(newPath);

    fs.unlink(tempPath, (err) => {
      if (err) {
        console.error("Error is", err);
      }
    });

    const relativePath = `uploads/${path.basename(newPath)}`;
    postData.image = relativePath;
  }
  const postDoc = await Post.create(postData);
  res.json({ postDoc });
};

export const postGet = async (req: Request, res: Response) => {
  const userId = (req as any).user ? (req as any).user.id : null;

  const posts = await Post.find()
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(30);

  const postPromises = posts.map(async (post) => {
    const userComments = await Comments.find({
      commentedOn: post._id,
    }).populate("user", "username userAvatar");

    const likeCount = await Likes.countDocuments({ likedPost: post._id });

    const postData: any = {
      ...post.toJSON(),
      likeCount,
      userComments,
    };

    if (userId) {
      const isLiked = await Likes.findOne({
        user: userId,
        likedPost: post._id,
      });
      postData.isLiked = isLiked != null;
    }

    return postData;
  });

  const newPosts = await Promise.all(postPromises);

  res.json(newPosts);
};

export const getPostId = async (req: Request, res: Response) => {
  let id = req.params.id;
  const postId = await Post.findById(id);
  res.json(postId);
};

export const postCommentsById = async (req: Request, res: Response) => {
  const commentedOn = req.params.id;
  const username = req.user.username;
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
};

export const postLikesById = async (req: Request, res: Response) => {
  {
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
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const postId = req.params.id;

    const postDoc = await Post.findById(postId);

    if (!postDoc) {
      return res.status(404).json({ message: "Post not found" });
    }

    const authorCheck = postDoc.author._id.toString() === userId;

    if (!authorCheck) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(postId);

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};