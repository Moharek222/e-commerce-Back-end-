import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from "cookie-parser";
import userRouter from './src/user/user-router';
import cors from 'cors';
import authRouter from './src/auth/auth-router';
import cartRouter from './src/cart/cart-router';
import productRouter from './src/product/product-router';
import categoryRouter from './src/category/category-router';
import reviewRouter from './src/review/review-router';

dotenv.config();
const app = express();
const PORT = Number(process.env.PORT)|| 3000;
const URI = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;
mongoose.connect(`${URI}/${DB_NAME}`)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => {
        console.error("MongoDB connection error:", err);

        process.exit(1);
    });

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));




app.use("/api/auth", authRouter);
app.use("/api/user",userRouter); 
app.use("/api/category",categoryRouter);
app.use("/api/product",productRouter);
app.use("/api/cart",cartRouter);

app.use("/api/review",reviewRouter);







app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});