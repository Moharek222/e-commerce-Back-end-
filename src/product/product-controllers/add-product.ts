import { RequestHandler } from "express";
import { body } from "express-validator";
import { Product } from "../product-model";


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
export const addProduct: RequestHandler<{}, IResponse, IRequest> = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        return res.status(201).json({
            message: "Product created successfully",
            data: product
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}