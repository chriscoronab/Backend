import { Router } from "express";
import { loginRender, registerRender, chatRender, forgotPasswordRender, forgotPassword, resetPasswordRender, resetPassword, logger } from "../controllers/views.controller.js";
import { publicAccess, authorization } from "../utils.js";

const router = Router();

router.get("/", publicAccess, loginRender);

router.get("/register", publicAccess, registerRender);

router.get("/chat", authorization("User"), chatRender);

router.get("/forgot-password", publicAccess, forgotPasswordRender);

router.post("/forgot-password", publicAccess, forgotPassword);

router.get("/reset-password", publicAccess, resetPasswordRender);

router.post("/reset-password", publicAccess, resetPassword);

router.get("/logger", logger);

export default router;