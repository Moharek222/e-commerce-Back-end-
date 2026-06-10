import mongoose from "mongoose";

export interface IProduct extends mongoose.Document {
    userID: mongoose.Types.ObjectId;
    categoryID: mongoose.Types.ObjectId;
    name: string;
    description: string;
    image: string;
    price: number;
    quantity: number;
}

const productSchema= new mongoose.Schema<IProduct>({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    categoryID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
},
    price: {
        type: Number,
        required: true,
        min: [1, "Price must be at least 1"]
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity must be at least 1"]
    }
},{timestamps: true} );

export const Product=mongoose.model<IProduct>("Product", productSchema);
