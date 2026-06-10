import { RequestHandler } from "express";
import { Product } from "../product-model";
import mongoose from "mongoose";


interface IRequest {
    name: string;
    description: string;
    image: string;
    price: number;
    quantity: number;
    categoryID: string
}

interface IResponse {
    message: string;
    data?: any
}

export const updateProduct: RequestHandler<{ id: string }, IResponse, IRequest> = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid product id format"
            });
        }
        const product = await Product.findByIdAndUpdate(
            req.params.id, req.body,
            { new: true }
        )
            .populate("categoryID", "name")
            .lean();
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        res.status(200).json({
            message: "Product updated successfully",
            data: product
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}