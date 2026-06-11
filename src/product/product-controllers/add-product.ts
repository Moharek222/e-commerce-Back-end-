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
        const {name,description ,image ,price, quantity, categoryID}=req.body;
        const userID=req.user?.id
        if (!userID) {
            return res.status(401).json({ message: "Unauthorized: Admin ID not found" });
        }
        const existingProduct = await Product.findOne({ name });
                if (existingProduct) {
                    return res.status(400).json({ 
                        message: "Product name already exists" 
                    });
                }
                const imageUrl = req.file?.path; 

        if (!imageUrl) {
            return res.status(400).json({ message: "Image is required" });
        }

        const product = await Product.create({
            name,
            description,
            image: imageUrl,
            price,
            quantity,
            categoryID ,
            userID});
        return res.status(201).json({
            message: "Product created successfully",
            data: product
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}