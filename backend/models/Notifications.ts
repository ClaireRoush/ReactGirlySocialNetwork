import { Schema, model } from "mongoose";
import { IUser } from "./User";


export interface INotification {
    userId: IUser;
    commentedOn: String;
    likedOn: String;
    userAvatar: String;
    whoIsPost: IUser;
    isRead: Boolean;
}


const NotificationsSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    commentedOn: { type: String, ref: "Comments" },
    likedOn: { type: String, ref: "Likes" },
    userAvatar: { type: String, ref: "User" },
    whoIsPost: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const NotificationsModel = model<INotification>("Notifications", NotificationsSchema);

export default NotificationsModel;
