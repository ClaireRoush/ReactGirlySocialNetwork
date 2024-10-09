import { Request, Response } from "express";
import dotenv from "dotenv";
import Post from "../models/Post";
import User from "../models/User";
import Likes from "../models/Likes";
import Messages from "../models/Messages";
import Comments from "../models/Comments";
import Notifications from "../models/Notifications";

export const getNotifications = async (req: Request, res: Response) => {
  let userId = req.user.id;
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
};
