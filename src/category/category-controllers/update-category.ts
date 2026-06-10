import { RequestHandler } from "express";
import mongoose from "mongoose";
import { Category } from "../category-model";


interface IRequest {
    name: string;
    description: string;
    isActive?: boolean;
}
interface IResponse {
    message: string;
    data?: any;
}


export const updateCategory: RequestHandler<{ id: string }, IResponse, IRequest> = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid category id format"
            });
        }
        const category = await Category.findByIdAndUpdate(
            req.params.id, req.body,
            { new: true }
        )
            .lean();
        if (!category) {
            return res.status(404).json({
                message: "category not found"
            });
        }
        return res.status(200).json({
            message: "category updated successfully",
            data: category
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}