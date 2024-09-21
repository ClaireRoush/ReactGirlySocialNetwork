import { Schema, model } from "mongoose";

import { IUser } from "./User";
import { IPost } from "./Post";


export interface ILike{
    user: IUser
    likedPost: IPost
}


const LikesSchema = new Schema<ILike>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  likedPost: { type: Schema.Types.ObjectId, ref: "Post", required: true },
});

const LikesModel = model<ILike>("Likes", LikesSchema);

export default LikesModel;