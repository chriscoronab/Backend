import { Router } from "express";
import { getUsers, deleteInactiveUsers, deleteUser, userToggle } from "../controllers/users.controller.js";
import { authorization } from "../utils.js";

const router = Router();

router.get("/", authorization("Admin"), getUsers);

router.delete("/", authorization("Admin"), deleteInactiveUsers);

router.delete("/:uid", authorization("Admin"), deleteUser);

router.put("/premium/:uid", authorization("Admin"), userToggle);

export default router;