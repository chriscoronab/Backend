import messageModel from "../dao/models/messages.model.js";

export const loginRender = (req, res) => {
    try {
        res.status(200).render("login", {});
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const registerRender = (req, res) => {
    try {
        res.status(200).render("register", {});
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const chatRender = async (req, res) => {
    try {
        const messages = await messageModel.find().lean().exec();
        res.status(200).render("chat", { messages });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};