const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CommentsSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  text: { type: String, required: true },
  userAvatar: { type: Schema.Types.ObjectId, ref: "User" },
  commentedOn: { type: String, required: true },
});

const CommentsModel = model("Comments", CommentsSchema);

module.exports = CommentsModel;
