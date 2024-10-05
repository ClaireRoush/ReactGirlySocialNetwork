const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const LikesSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  likedPost: { type: Schema.Types.ObjectId, ref: "Post", required: true },
});

const LikesModel = model("Likes", LikesSchema);

export default LikesModel;