import { Schema, model } from "mongoose";

export interface IUserParams {
  username: string;
  userAvatar: string;
  userDesc: string;
}


const UserParamsSchema = new Schema<IUserParams>({
  username: { type: String, required: true },
  userAvatar: { type: String, required: false },
  userDesc: { type: String, required: false },
});

const UserParamsModel = model<IUserParams>("UserParams", UserParamsSchema);

module.exports = UserParamsModel;
