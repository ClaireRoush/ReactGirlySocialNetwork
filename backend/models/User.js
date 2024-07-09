const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: true, min: 4, unique: true },
  password: { type: String, required: true },
  userAvatar: { type: String, default: "", required: false },
  userDesc: { type: String, default: "", required: false },
  pronouns: { type: String, default: "", required: false },
  profileHashColor: {
    type: String,
    default: "#a6e3a1",
    required: false,
    min: 4,
    max: 7,
  },
});

const UserModel = model("User", UserSchema);

module.exports = UserModel;
