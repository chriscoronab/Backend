import { Router } from "express";
import passport from "passport";
import { login, register, github, githubCallback, currentRender, logout, errorRender } from "../controllers/session.controller.js";
import { authentication } from "../utils.js";

const router = Router();

router.post("/", passport.authenticate("login", { failureRedirect: "/session/error?error=Error%20en%20el%20login" }), login);

router.post("/register", passport.authenticate("register", { failureRedirect: "/session/error?error=Error%20en%20el%20registro" }), register);

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), github);

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/session/error?error=GitHub%20fail" }), githubCallback);

router.get("/current", authentication, passport.authenticate("jwt", { session: false }), currentRender);

router.get("/logout", logout);

router.get("/error", errorRender);

export default router;