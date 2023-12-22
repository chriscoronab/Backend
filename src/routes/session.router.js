import { Router } from "express";
import passport from "passport";

const router = Router();

function auth(req, res, next) {
    if (!req.user) return res.status(401).redirect("/");
    next();
};

router.post("/", passport.authenticate("login", { failureRedirect: "/session/error?error=Error%20en%20el%20login" }), async (req, res) => {
    try {
        if (!req.user) return res.status(400).send({ error: "Credenciales inválidas" });
        res.cookie("cookieJWT", req.user.token).redirect("/session/current");
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

router.post("/register", passport.authenticate("register", { failureRedirect: "/session/error?error=Error%20en%20el%20registro" }), async (req, res) => {
    try {
        res.status(200).redirect("/");
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { });

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/session/error?error=GitHub%20fail" }), (req, res) => {
    try {
        if (!req.user) return res.status(400).send({ error: "Invalid GitHub" });
        res.cookie("cookieJWT", req.user.token).redirect("/session/current");
    } catch {
        res.status(500).send({ error: error.message });
    };
});

router.get("/current", auth, passport.authenticate("jwt", { session: false }), (req, res) => {
    try {
        const { user } = req.user;
        res.status(200).render("current", { user });
    } catch {
        res.status(500).send({ error: error.message });
    };
});

router.get("/logout", (req, res) => {
    req.session.destroy(error => {
        if (error) return res.status(500).send({ error: error.message });
        res.status(200).redirect("/");
    });
});

router.get("/error", (req, res) => {
    try {
        const error = req.query?.error ?? "Error on Server";
        res.status(400).render("error", { error });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

export default router;