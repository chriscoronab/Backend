import { Router } from "express";
import { createPayment, paymentFailure } from "../controllers/payment.controller.js";
import { authorization } from "../utils.js";

const router = Router();

router.get("/", authorization("User", "Premium"), createPayment);

router.get("/failure", authorization("User", "Premium"), paymentFailure);

export default router;