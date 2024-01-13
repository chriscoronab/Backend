import { Router } from "express";
import { loginRender, registerRender, chatRender } from "../controllers/views.controller.js";
import { publicAccess } from "../utils.js";

const router = Router();

router.get("/", publicAccess, loginRender);

router.get("/register", publicAccess, registerRender);

router.get("/chat", chatRender);

export default router;