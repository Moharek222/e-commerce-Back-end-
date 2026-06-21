import { RequestHandler } from "express";
import { Order } from "../order-model";
import { Cart } from "../../cart/cart-model";
import { body } from "express-validator";


export const validator = [
    body("shippingAddress.street")
        .trim()
        .notEmpty()
        .withMessage("Street is required"),
    body("shippingAddress.city")
        .trim()
        .notEmpty()
        .withMessage("City is required"),
    body("shippingAddress.phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required"),
    body("paymentMethod")
        .trim()
        .notEmpty()
        .withMessage("Payment method is required")
        .isIn(["cash", "card"])
        .withMessage("Payment method must be 'cash' or 'card'")
];

interface IShippingAddress {
    street: string;
    city: string;
    phone: string;
}

interface IRequest {
    shippingAddress: IShippingAddress;
    paymentMethod?: string;
}

interface IResponse {
    message: string;
    data?: any;
}

export const createOrder: RequestHandler<{}, IResponse, IRequest> = async (req, res) => {
    try {
        const userID = req.user?.id;
        if (!userID) {
            return res.status(401).json({ message: "Unauthorized: User ID not found" });
        }

        const { shippingAddress, paymentMethod } = req.body;

        const cart = await Cart.findOne({ userID }).populate("items.productID", "price");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Your cart is empty" });
        }

        let calculatedTotal = 0;
        const orderItems: any[] = [];

        for (const item of cart.items) {
            if (!item.productID) {
                continue;
            }

            const productPrice = (item.productID as any).price;
            calculatedTotal += productPrice * item.quantity;

            orderItems.push({
                productID: (item.productID as any)._id,
                quantity: item.quantity,
                price: productPrice
            });
        }
        if (orderItems.length === 0) {
            return res.status(400).json({ message: "All products in your cart are no longer available" });
        }
        const newOrder = await Order.create({
            userID,
            items: orderItems,
            totalPrice: calculatedTotal,
            shippingAddress,
            paymentMethod: paymentMethod || "cash"
        });
        await Cart.findOneAndUpdate({ userID }, { items: [] });

        await newOrder.populate([
            { path: "userID", select: "name email" },
            { path: "items.productID", select: "title image" }
        ]);

        return res.status(201).json({
            message: "Order created successfully",
            data: newOrder
        });

    } catch (error) {
        console.error("Create Order Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};