import { Router } from "express";
import UserManager from "../dao/managers/db/userManager.js";
import userModel from "../dao/models/users.model.js";

const router = Router();
const userManager = new UserManager();

router.post("/", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email, password });
        if (!user) return res.status(404).send({ error: "Credenciales incorrectas" });
        req.session.user = user;
        if (user.email === "adminCoder@coder.com" && user.password === "adminCod3r123") {
            req.session.user = {
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                age: user.age,
                role: "admin"
            };
        } else {
            req.session.user = {
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                age: user.age,
                role: "user"
            };
        };
        res.status(200).redirect("/products");
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

router.post("/register", async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const user = await userManager.getUser(email);
        if (user) return res.status(400).send({ error: `El usuario ${user.email} ya existe` });
        const newUser = { first_name, last_name, email, age, password };
        await userManager.createUser(newUser);
        res.status(200).redirect("/products");
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

router.get("/logout", (req, res) => {
    req.session.destroy(error => {
        if (error) return res.status(500).send({ error: error.message });
        res.status(200).redirect("/");
    });
});

export default router;