import { Schema, model } from "mongoose";

import { IUser } from "./User";

export interface IMessage {
    user: IUser;
    forWho: IUser;
    message: String;
    userAvatar: String;
}


const MessagesSchema = new Schema<IMessage>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  forWho: { type: Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  userAvatar: { type: String, ref: "User", required: true },
});

const MessagesModel = model<IMessage>("Messages", MessagesSchema);

export default MessagesModel;
