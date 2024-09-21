import { Schema, model } from "mongoose"

export interface IUser {
  _id: String
  username: String,
  password: String,
  userAvatar: String,
  userDesc?: String,
  pronouns: String,
  profileHashColor: String,
  contacts: Array<String>,
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, min: 4, unique: true },
    password: { type: String, required: true },
    userAvatar: { type: String, default: "/static/images/default_user_avatar.png", required: false },
    userDesc: { type: String, default: "", required: false },
    pronouns: { type: String, default: "", required: false },
    profileHashColor: {
      type: String,
      default: "#a6e3a1",
      required: false,
      min: 4,
      max: 7,
    },
    contacts: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

const UserModel = model<IUser>("User", UserSchema);

export default UserModel;
