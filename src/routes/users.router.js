import { Router } from "express";
import { userToggle } from "../controllers/users.controller.js";

const router = Router();

router.put("/premium/:uid", userToggle);

export default router;