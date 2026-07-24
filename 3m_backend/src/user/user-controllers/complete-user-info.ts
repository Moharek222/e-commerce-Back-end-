import { RequestHandler } from "express";
import { IAddress, User } from "../user-model";
import { body } from "express-validator";

export const completeUserInfoValidator = [
    body("phone")
        .optional()
        .isString().withMessage("Phone must be a string")
        .isMobilePhone("ar-EG").withMessage("Please enter a valid Egyptian phone number"),

    body("address")
        .optional()
        .isObject().withMessage("Address must be an object"),

    body("address.street")
        .if(body("address").exists())
        .notEmpty().withMessage("Street is required when adding an address")
        .isString().withMessage("Street must be a text")
        .trim(),

    body("address.city")
        .if(body("address").exists())
        .notEmpty().withMessage("City is required when adding an address")
        .isString().withMessage("City must be a text")
        .trim(),

    body("address.country")
        .if(body("address").exists())
        .notEmpty().withMessage("Country is required when adding an address")
        .isString().withMessage("Country must be a text")
        .trim(),
];

interface IRequest {
    address?: IAddress;
    phone?: string;
}

interface IResponse {
    message: string;
    data?: any;
}

export const completeUserInfo: RequestHandler<{}, IResponse, IRequest> = async (req, res) => {
    try {
        const id = req.user!.id;
        const updateObj: Partial<IRequest> = {}
        const { address, phone } = req.body;
        if (address) {
            updateObj.address = address;
        }
        if (phone) {
            updateObj.phone = phone;
        }
        if (req.body.address?.isDefault) {
            await User.updateOne(
                { _id: id },
                { $set: { "address.$[].isDefault": false } }
            );
        }
        const user = await User.findByIdAndUpdate(id, { $push: updateObj }, { new: true });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        return res.status(200).json({
            message: "User info updated successfully",
            data: user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}