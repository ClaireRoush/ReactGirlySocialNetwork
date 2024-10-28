import { Schema, model } from "mongoose"

export interface IUser {
  _id: string
  username: string,
  password: string,
  userAvatar: string,
  userDesc?: string,
  pronouns: string,
  profileHashColor: string,
  contacts: Array<string>,
  lastCodeUpdate?: Date
  usedCodesIndexes: Array<number>
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
    lastCodeUpdate: { type: Date, default: new Date(-8640000000000000) }, // yep. thanks javascript :S
    usedCodesIndexes: [{ type: Number, default: [] }],
  },
  {
    timestamps: true,
  }
);

const UserModel = model<IUser>("User", UserSchema);

export default UserModel;
