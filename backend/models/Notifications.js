const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const NotificationsSchema = new Schema(
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

const NotificationsModel = model("Notifications", NotificationsSchema);

module.exports = NotificationsModel;
