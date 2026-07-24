import { RequestHandler } from "express";
import { User } from "../user-model";


interface IRequest {
    profileImage: string;
}

interface IResponse {
    message: string;
    data?: any;
}
    
export const addUserImage: RequestHandler<{}, IResponse, IRequest> = async (req, res) => {
    try {
        const profileImage = req.file?.path;
        const id = req.user!.id;
        if (!profileImage) {
            return res.status(400).json({ message: "Profile image is required" });
        }
        const user = await User.findByIdAndUpdate(
            id, 
            { profileImage }, 
            { 
                new: true ,
                runValidators: true 
            });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.profileImage = profileImage;
        await user.save();
        return res.status(200).json({ 
            message: "Profile image updated successfully",
            data: user
        });
    }catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }

}