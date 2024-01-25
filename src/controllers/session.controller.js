import UserDTO from "../dto/users.dto.js";

export const login = async (req, res) => {
    try {
        if (!req.user) return res.status(400).send({ error: "Credenciales inválidas" });
        req.session.user = req.user;
        return res.cookie("cookieJWT", req.user.token).redirect("/session/current");
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const register = async (req, res) => {
    try {
        return res.status(200).redirect("/");
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const github = async (req, res) => { };

export const githubCallback = (req, res) => {
    try {
        req.session.user = req.user;
        if (!req.user) return res.status(400).send({ error: "Invalid GitHub" });
        return res.cookie("cookieJWT", req.user.token).redirect("/session/current");
    } catch {
        res.status(500).send({ error: error.message });
    };
};

export const currentRender = (req, res) => {
    try {
        const userData = req.session.user;
        const user = new UserDTO(userData);
        return res.status(200).render("current", { user });
    } catch {
        res.status(500).send({ error: error.message });
    };
};

export const logout = (req, res) => {
    try {
        req.session.destroy(error => {
            if (error) return res.status(500).send({ error: error.message });
            return res.clearCookie("cookieJWT").redirect("/");
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const errorRender = (req, res) => {
    try {
        const error = req.query?.error ?? "Error on Server";
        return res.status(400).render("error", { error });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};