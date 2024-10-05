import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: `.env.local`, override: true });

const app = express();

const secret = process.env.JWT_SECRET;
const salt = bcrypt.genSaltSync(10);

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(400).json(e);
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.json({
        id: userDoc._id,
        username,
        token,
      });
    });
  } else {
    res.status(400).json("Wrong!!!");
  }
};
