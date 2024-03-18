import UserDTO from "../dto/users.dto.js";
import { userService } from "../services/index.js";

export const login = async (req, res) => {
    try {
        req.session.user = req.user;
        const user = req.user;
        if (!user) {
            req.logger.error("Invalid credentials");
            return res.status(400).send({ error: "Invalid credentials" });
        };
        req.logger.info("Successful login");
        return res.cookie("cookieJWT", user.token).redirect("/session/current");
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const register = async (req, res) => {
    try {
        req.logger.info("User registered successfully");
        return res.status(201).redirect("/");
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const github = async (req, res) => { };

export const githubCallback = async (req, res) => {
    try {
        req.session.user = req.user;
        const user = req.user;
        if (!user) {
            req.logger.error("Invalid GitHub");
            return res.status(400).send({ error: "Invalid GitHub" });
        };
        req.logger.info("Successful login");
        return res.cookie("cookieJWT", user.token).redirect("/session/current");
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const currentRender = (req, res) => {
    try {
        const userData = req.session.user;
        const user = new UserDTO(userData);
        return res.status(200).render("current", { user });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const logout = (req, res) => {
    req.session.destroy(async (err) => {
        if (err) return res.status(500).send({ error: err.message });
        try {
            const user = req.user;
            user.last_connection = new Date();
            await userService.updateUser(user._id, user);
            req.logger.info("Successful logout");
            return res.clearCookie("cookieJWT").redirect("/");
        } catch (error) {
            res.status(500).send({ error: error.message });
        };
    });
};

export const errorRender = (req, res) => {
    try {
        const error = req.query?.error ?? "Error on Server";
        return res.status(400).render("error", { error });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};