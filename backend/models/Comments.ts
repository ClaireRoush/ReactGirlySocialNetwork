import { Schema, model } from "mongoose";

import { IUser } from "./User";


export interface IComment {
  user: IUser
  text: String
  userAvatar: IUser
  commentedOn: String
}


const CommentsSchema = new Schema<IComment>({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  text: { type: String, required: true },
  userAvatar: { type: Schema.Types.ObjectId, ref: "User" },
  commentedOn: { type: String, required: true },
});

const CommentsModel = model<IComment>("Comments", CommentsSchema);

export default CommentsModel;
