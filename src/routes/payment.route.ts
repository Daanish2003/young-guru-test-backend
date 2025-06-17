import { paymentOrderHandler, paymentVerifyHandler } from "../controllers/payment.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { Router } from "express";

const payment_router = Router();

payment_router.use(authMiddleware);
payment_router.route("/order").post(paymentOrderHandler);
payment_router.route("/verify").post(paymentVerifyHandler);

export default payment_router;
