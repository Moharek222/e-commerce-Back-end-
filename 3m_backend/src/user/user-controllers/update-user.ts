import { RequestHandler } from "express";
import { User } from "../user-model";

import { body } from "express-validator";

export const updateUserValidator = [
    body("name")
        .optional()
        .isString().withMessage("Name must be a text")
        .isLength({ min: 3, max: 50 }).withMessage("Name must be between 3 and 50 characters")
        .trim(),

    body("email")
        .optional()
        .isEmail().withMessage("Please enter a valid email address")
        .normalizeEmail(), 

    body("phone")
        .optional()
        .isString().withMessage("Phone must be a string")
        .isMobilePhone("ar-EG").withMessage("Please enter a valid Egyptian phone number"), 


    body("address")
        .optional()
        .isObject().withMessage("Address must be an object"),

    body("address.street")
        .if(body("address").exists())
        .notEmpty().withMessage("Street is required when updating address")
        .isString().withMessage("Street must be a text")
        .trim(),

    body("address.city")
        .if(body("address").exists())
        .notEmpty().withMessage("City is required when updating address")
        .isString().withMessage("City must be a text")
        .trim(),

    body("address.country")
        .if(body("address").exists())
        .notEmpty().withMessage("Country is required when updating address")
        .isString().withMessage("Country must be a text")
        .trim(),
];

interface IAddress {
    street: string;
    city: string;
    country: string;
}

interface IRequest {
    id: string;
    name?: string;
    email?: string;
    address?: IAddress;
    phone?: string;
}
interface IResponse {
    message: string;
    data?: any;
}

export const updateUser:RequestHandler<{}, IResponse, IRequest> = async (req, res) => {
    try{
        const id=req.user!.id;
        const updateObj:Partial<IRequest>={}
        const {name,email,address,phone}=req.body;
        if(name){
            updateObj.name=name;
        }
        if(email){
            updateObj.email=email;
        }
        if(address){
            if(!address.street || !address.city || !address.country){
                return res.status(400).json({
                    message:"Address details is required"
                });
            }
            updateObj.address=address;
        }
        if(phone){
            updateObj.phone=phone;
        }
        const user=await User.findByIdAndUpdate(id,{$set:updateObj},{new:true,runValidators:true});
        if(!user){
            return res.status(404).json({
                message:"User not found"
            });
        }
        return res.status(200).json({
            message:"User updated successfully",
            data:user
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}