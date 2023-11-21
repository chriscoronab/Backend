import { Router } from "express";
import messageModel from "../dao/models/messages.model.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const messages = await messageModel.find().lean().exec();
        res.status(200).render("chat", {
            style: "index.css",
            messages
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

export default router;