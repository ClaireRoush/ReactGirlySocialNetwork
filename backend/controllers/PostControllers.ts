import { Request, Response } from "express";
import sharp from "sharp";
import dotenv from "dotenv";
import Post, { IPost } from "../models/Post";
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
      gif: "gif",
    };

    const format = formatMap[ext];

    if (format === "gif") {
      fs.writeFileSync(newPath, fs.readFileSync(tempPath));
    }
    else {
      await sharp(tempPath)
        .toFormat(format)
        .jpeg({ quality: 30 })
        .toFile(newPath);
    }

    fs.unlink(tempPath, (err) => {
      if (err) {
        console.error("Error is", err);
      }
    });

    const relativePath = `uploads/${path.basename(newPath)}`;
    postData.image = relativePath;
  }
  const postDoc = await (
    await Post.create(postData)
  ).populate("author", "username");
  res.json({ postDoc });
};

export const postGet = async (req: Request, res: Response) => {
  const userId = (req as any).user ? (req as any).user.id : null;

  const limit = Number.parseInt((req.query.limit || "5").toString()); // ye
  const offset = Number.parseInt((req.query.offset || "0").toString()); // ye
  const username = req.query.username ? req.query.username.toString() : null;

  let posts;

  if (username) {
    const userId = await User.findOne({ username: username }).select("_id");

    posts = await Post.find({ author: userId })
      .populate("author", ["username", "userAvatar"])
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
  } else {
    posts = await Post.find()
      .populate("author", ["username", "userAvatar"])
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
  }

  const postPromises = posts.map(async (post) => {
    const likeCount = await Likes.countDocuments({ likedPost: post._id });
    const commentsCount = await Comments.countDocuments({
      commentedOn: post._id,
    });

    const postData: any = {
      ...post.toJSON(),
      likeCount,
      commentsCount,
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

export const getPostById = async (req: Request, res: Response) => {
  const id = req.params.id;

  const post = await Post.findById(id).populate("author", ["username"]);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const likeCount = await Likes.countDocuments({ likedPost: post._id });
  const commentsCount = await Comments.countDocuments({
    commentedOn: post._id,
  });

  // Собираем данные для ответа
  const postData = {
    ...post.toJSON(),
    likeCount,
    commentsCount,
  };

  res.json(postData);
};

export const getPostByUser = async (req: Request, res: Response) => {
  const user = req.params.user;
  const findUserInfo = await User.findOne({ username: user });
  const userId = findUserInfo._id;
  const getPosts = await Post.find({ author: userId }).sort({ createdAt: -1 });

  const commentsPromises = getPosts.map(async (post) => {
    const likeCount = await Likes.countDocuments({ likedPost: post._id });
    const commentsCount = await Comments.countDocuments({
      commentedOn: post._id,
    });

    const postData: any = {
      ...post.toJSON(),
      likeCount,
      commentsCount,
    };
    return postData;
  });
  const commentsDoc = await Promise.all(commentsPromises);

  res.json(commentsDoc);
};

export const getCommentsByPostId = async (req: Request, res: Response) => {
  const id = req.params.id;
  const findComments = await Comments.find({
    commentedOn: id,
  }).populate("user", "username userAvatar");
  res.json(findComments);
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
  res.json(postDoc);
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

export const deleteComment = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const commentId = req.params.id;

  const findPost = await Comments.findById(commentId);

  const authorCheck = findPost.user.toString() === userId;

  if (authorCheck) {
    await Comments.findByIdAndDelete(commentId);
  } else {
    res.json("404, Comment not found, silly!!11!!!");
  }
  res.json(authorCheck);
};
