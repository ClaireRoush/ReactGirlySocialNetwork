import { Request, Response } from "express";
import User from "../models/User";
import Post from "../models/Post";
import Likes from "../models/Likes";

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

export const userProfilePostsByUser = async (req: Request, res: Response) => {
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
  async (req: Request, res: Response) => {
    const { userAvatar, userDesc, username, pronouns, profileHashColor } =
      req.body;
    const userId = req.user.id;

    const updatedUserData = {
      userAvatar,
      userDesc,
      username,
      pronouns,
      profileHashColor,
    };

    try {
      const user = await User.findOneAndUpdate(
        { _id: userId },
        updatedUserData,
        { new: true }
      );
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user settings" });
    }
  };
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
