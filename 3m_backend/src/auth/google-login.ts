import { RequestHandler } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User, Role } from "../user/user-model";
import dotenv from "dotenv";
import { COOKIE_OPTIONS } from "./login";
dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin: RequestHandler = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(401).json({ message: "Google token is required" });
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            return res.status(400).json({ message: "Invalid Google token payload" });
        }

        const { email, name, picture } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            const randomPassword = crypto.randomBytes(16).toString("hex");
            user = await User.create({
                name: name || "Google User",
                email: email,
                password: randomPassword,
                profileImage: picture,
                role: Role.User
            });
        }

        if (!process.env.secretKey) {
            throw new Error("JWT secret is missing");
        }
        const jwtToken = jwt.sign(
            { id: user._id, role: user.role },
            process.env.secretKey as string,
            { expiresIn: "7d" }
        );
        res.cookie("token", jwtToken, {
            ...COOKIE_OPTIONS,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Logged in successfully with Google",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Google Auth Error:", error);
        return res.status(500).json({ message: "Internal server error during Google login" });
    }
};