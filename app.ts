import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import userRouter from './src/user/user-router';
import cors from 'cors';
import authRouter from './src/auth/auth-router';
import cartRouter from './src/cart/cart-router';
import productRouter from './src/product/product-router';
import categoryRouter from './src/category/category-router';
import reviewRouter from './src/review/review-router';
import orderRouter from './src/order/order-router';
import paymentRouter from './src/payment/payment-router';
import { stripeWebhook } from './src/payment/webhook-controller';
// import { setupSwagger } from './src/swagger';

dotenv.config();
const app = express();
// setupSwagger(app);
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
app.use(express.static("public"));
app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), stripeWebhook);
app.use(express.json());


app.use("/api/auth", authRouter);
app.use("/api/user",userRouter); 
app.use("/api/category",categoryRouter);
app.use("/api/product",productRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);
app.use("/api/review",reviewRouter);
app.use("/api/payment",paymentRouter);
// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Global Error Handler:", err);
    res.status(500).json({
        message: err.message || "Internal Server Error",
        stack: err.stack 
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});