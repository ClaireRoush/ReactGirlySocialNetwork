import { Request, Response } from "express";
import User from "../models/User";
import Messages from "../models/Messages";
import mongoose from "mongoose";

export const postMessagesForWho = async (req: Request, res: Response) => {
  const username = req.user.username;
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
};

export const getMessagesByUser = async (req: Request, res: Response) => {
  const currentUsername = req.user.username;
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
};

export const postContactsByUser = async (req: Request, res: Response) => {
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
};

export const getContacts = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const userInfo = await User.findById(userId);

  if (!userInfo) {
    return res.status(404).json({ message: "User not found" });
  }

  const contacts = await User.find(
    { _id: { $in: userInfo.contacts } },
    "username userAvatar"
  );

  const contactsInfo = contacts.map((contact) => ({
    username: contact.username,
    userAvatar: contact.userAvatar,
  }));

  res.json(contactsInfo);
};
