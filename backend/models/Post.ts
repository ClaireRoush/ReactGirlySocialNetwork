import { Schema, model } from "mongoose";
import { IUser } from "./User";

export interface IPost {
  _id: string;
  title: String;
  summary: String;
  content: String;
  image: String;
  author: IUser;
}

const PostSchema = new Schema<IPost>(
  {
    title: String,
    summary: String,
    content: String,
    image: String,
    author: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const PostModel = model<IPost>("Post", PostSchema);

export default PostModel;
