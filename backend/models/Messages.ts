const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const MessagesSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  forWho: { type: Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  userAvatar: { type: String, ref: "User", required: true },
});

const MessagesModel = model("Messages", MessagesSchema);

export default MessagesModel;
