import { Request, Response } from "express";
import User, { IUser } from "../models/User"
import { sha256 } from "js-sha256";
import bcrypt from "bcryptjs";

const RECOVERY_CODE_COUNT = Number.parseInt(process.env.RECOVERY_CODE_COUNT);
const RECOVERY_CODE_SALT = process.env.RECOVERY_CODE_SALT;
const RECOVERY_CODE_LENGTH = Number.parseInt(process.env.RECOVERY_CODE_LENGTH);

const bcryptSalt = bcrypt.genSaltSync(10);

const generateRecoveryCode = (user: IUser) => {
    let codes = []

    const salt_hash = sha256(RECOVERY_CODE_SALT);

    const initial_value = user._id.toString() + user.lastCodeUpdate.getTime().toString();

    for (let i = 0; i < RECOVERY_CODE_COUNT; i++) {
        codes.push(sha256(initial_value + salt_hash[i]).split("").slice(0, RECOVERY_CODE_LENGTH).join("").toUpperCase()); // with upper they look pretier :D // ! DON'T FORGET TO ALLOW ON FRONTEND ONLY UPPERCASE CHARACTERS
    }
    return codes
}

export const getUpdateRecoveryCodes = async (req: Request, res: Response) => {
    const user = await User.findById(req.user.id);
    user.lastCodeUpdate = new Date();
    user.usedCodesIndexes = [];
    let codes = generateRecoveryCode(user);
    await user.save();

    res.json(codes);
}

export const checkRecoveryCode = async (req: Request, res: Response) => {
    const { username, code, newPassword } = req.body;
    const user = await User.findOne({ username: username });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if (!code || !newPassword) {
        return res.status(400).json({ message: "Bad request" });
    }
    const codes = generateRecoveryCode(user);

    if (codes.includes(code) && !user.usedCodesIndexes.includes(codes.indexOf(code))) {
        user.usedCodesIndexes.push(codes.indexOf(code));

        user.password = bcrypt.hashSync(newPassword, bcryptSalt);

        await user.save();
        res.json({message: "ok", check: true});
    } else {
        res.json({message: "code was used or don't exist", check: false});
    }
}
