const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserParamsSchema = new Schema({
  username: { type: String, required: true },
  userAvatar: { type: String, required: false },
  userDesc: { type: String, required: false },
});

const UserParamsModel = model("UserParams", UserParamsSchema);

module.exports = UserParamsModel;
