import { RequestHandler } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../user/user-model";
import dotenv from "dotenv";
dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin: RequestHandler = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: "Google token is required" });
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            return res.status(400).json({ message: "Invalid Google token payload" });
        }

        const { email, name } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            const randomPassword = crypto.randomBytes(16).toString("hex");
            user = await User.create({
                name: name || "Google User",
                email: email,
                password: randomPassword,
                role: "user" 
            });
        }

        const jwtToken = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            message: "Logged in successfully with Google",
            token: jwtToken,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Google Auth Error:", error);
        return res.status(500).json({ message: "Internal server error during Google login" });
    }
};