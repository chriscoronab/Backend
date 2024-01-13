export const login = async (req, res) => {
    try {
        if (!req.user) return res.status(400).send({ error: "Credenciales inválidas" });
        res.cookie("cookieJWT", req.user.token).redirect("/session/current");
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const register = async (req, res) => {
    try {
        res.status(200).redirect("/");
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const github = async (req, res) => { };

export const githubCallback = (req, res) => {
    try {
        if (!req.user) return res.status(400).send({ error: "Invalid GitHub" });
        res.cookie("cookieJWT", req.user.token).redirect("/session/current");
    } catch {
        res.status(500).send({ error: error.message });
    };
};

export const currentRender = (req, res) => {
    try {
        const { user } = req.user;
        res.status(200).render("current", { user });
    } catch {
        res.status(500).send({ error: error.message });
    };
};

export const logout = (req, res) => {
    req.session.destroy(error => {
        if (error) return res.status(500).send({ error: error.message });
        res.status(200).redirect("/");
    });
};

export const errorRender = (req, res) => {
    try {
        const error = req.query?.error ?? "Error on Server";
        res.status(400).render("error", { error });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};