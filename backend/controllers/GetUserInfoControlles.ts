import { Request, Response } from "express";
import User from "../models/User";
import Post from "../models/Post";
import Likes from "../models/Likes";
import fs from "fs";
import sharp from "sharp";
import path from "path";

export const profile = async (req: Request, res: Response) => {
  res.json(req.user);
};

export const me = async (req: Request, res: Response) => {
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
};

export const userProfileByUsername = async (req: Request, res: Response) => {
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
};

export const userProfilePostsByUserId = async (req: Request, res: Response) => {
  const username = req.params.User;
  const user = await User.findOne({ username: username });
  res.json(
    await Post.find({ author: user._id })
      .populate("author", "username")
      .sort({ createdAt: -1 })
  );
};

export const changeInfo = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const user = await User.findOne({ _id: userId });
  res.json(user);
};

export const settings = async (req: Request, res: Response) => {
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
    .resize({
      width: 800,
      height: 800,
    })
    .jpeg({ quality: 50 })
    .toFile(newPath);

  fs.unlink(tempPath, (err) => {
    if (err) {
      console.error("Error in fs:", err);
    }
  });

  const relativePath = `uploads/userAvatars/${path.basename(newPath)}`;

  const { userDesc, username, pronouns, profileHashColor } = req.body;

  const userId = req.user.id;

  const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    {
      userAvatar: relativePath,
      userDesc: userDesc,
      username: username,
      pronouns: pronouns,
      profileHashColor: profileHashColor,
    },
    { new: true }
  );
  res.json(updatedUser);
};

export const findUserAvatarByUser = async (req: Request, res: Response) => {
  const user = req.params.User;
  const postDoc = await User.findOne({ username: user });
  try {
    res.json(postDoc.userAvatar);
  } catch (error) {
    res.status(404).json({ message: "Avatar not find!!!" });
  }
};

export const changePost = async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = req.user.id;

  const { content } = req.body;

  console.log(req.body);

  try {
    const postFind = await Post.findById(id);

    if (!postFind) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (postFind.author.toString() !== userId) {
      return res.status(403).json({ message: "You are not an author1!!!" });
    }

    postFind.content = content || postFind.content;

    await postFind.save();

    return res
      .status(200)
      .json({ message: "Post updated successfully", post: postFind });
  } catch (err) {
    console.error("Error updating post:", err); // For debugging purposes
    return res.status(500).json({ message: "Error updating post", error: err });
  }
};
