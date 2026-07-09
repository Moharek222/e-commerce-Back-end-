import { RequestHandler } from "express";
import { User } from "../user/user-model";




export const me: RequestHandler = async (req, res) => {
    try{
        const id = req.user!.id;
        const user= await User.findById(id).lean()
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            message: "User fetched successfully",
            data: user
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};