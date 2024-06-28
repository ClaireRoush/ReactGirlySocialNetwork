const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CommentsSchema = new Schema({
  user: { type: String, required: true},
  text: { type: String, required: true },
  userAvatar: { type: String, required: false },
  commentedOn: { type: String, required: true }
});


const CommentsModel = model("Comments", CommentsSchema);

module.exports = CommentsModel;
