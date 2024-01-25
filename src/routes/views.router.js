import { Router } from "express";
import { loginRender, registerRender, chatRender } from "../controllers/views.controller.js";
import { publicAccess, authorization } from "../utils.js";

const router = Router();

router.get("/", publicAccess, loginRender);

router.get("/register", publicAccess, registerRender);

router.get("/chat", authorization("User"), chatRender);

export default router;