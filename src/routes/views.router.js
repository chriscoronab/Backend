import { Router } from "express";

const router = Router();

function publicAccess(req, res, next) {
    if (req.user) return res.status(200).redirect("/session/current");
    next();
};

router.get("/", publicAccess, (req, res) => {
    try {
        res.status(200).render("login", {});
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

router.get("/register", publicAccess, (req, res) => {
    try {
        res.status(200).render("register", {});
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

export default router;