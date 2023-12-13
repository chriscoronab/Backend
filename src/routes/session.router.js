import { Router } from "express";
import passport from "passport";

const router = Router();

router.post("/", passport.authenticate("login", { failureRedirect: "/session/loginError" }), async (req, res) => {
    try {
        if (!req.user) return res.status(400).send({ error: "Credenciales inválidas" });
        if (req.user.email === "adminCoder@coder.com") {
            req.session.user = {
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                email: req.user.email,
                age: req.user.age,
                role: "Admin"
            };
        } else {
            req.session.user = {
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                email: req.user.email,
                age: req.user.age,
                role: "User"
            };
        };
        res.status(200).redirect("/products");
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

router.get("/loginError", (req, res) => {
    try {
        res.status(400).send({ error: "Error en el login" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

router.post("/register", passport.authenticate("register", { failureRedirect: "/session/registerError" }), async (req, res) => {
    try {
        res.status(200).redirect("/");
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

router.get("/registerError", (req, res) => {
    try {
        res.status(400).send({ error: "Error en el registro" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => {});

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/" }), (req, res) => {
    req.session.user = req.user;
    res.status(200).redirect("/products");
});

router.get("/logout", (req, res) => {
    req.session.destroy(error => {
        if (error) return res.status(500).send({ error: error.message });
        res.status(200).redirect("/");
    });
});

export default router;