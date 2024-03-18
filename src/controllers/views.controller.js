import { messageService, userService } from "../services/index.js";
import { createHash, isValidPassword, generateEmailToken, verifyEmailToken } from "../utils.js";
import { sendPasswordRecoveryEmail } from "../config/nodemailer.js";

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
        const messages = await messageService.renderMessages();
        return res.status(200).render("chat", { messages });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const forgotPasswordRender = (req, res) => {
    try {
        res.status(200).render("forgotPassword", {});
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userService.getUserByEmail(email);
        if (!user) {
            req.logger.error(`El usuario ${email} no está registrado`);
            return res.status(404).send({ error: `El usuario ${email} no está registrado` });
        };
        const token = generateEmailToken(email);
        await sendPasswordRecoveryEmail(email, token);
        req.logger.info(`Se envió un correo a ${email} para restablecer la contraseña`);
        return res.status(200).redirect("/");
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const resetPasswordRender = (req, res) => {
    try {
        const { token } = req.query;
        verifyEmailToken(token);
        return res.status(200).render("resetPassword", {});
    } catch (error) {
        req.logger.error("El link ha expirado. Por favor, genere uno nuevo.");
        return res.status(401).redirect("/forgot-password");
    };
};

export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await userService.getUserByEmail(email);
        if (!user) {
            req.logger.error(`El usuario ${email} no está registrado`);
            return res.status(404).send({ error: `El usuario ${email} no está registrado` });
        };
        if (isValidPassword(user, newPassword)) {
            req.logger.error("La contraseña debe ser diferente a la anterior");
            return res.status(400).send({ error: "La contraseña debe ser diferente a la anterior" });
        };
        const newPasswordHash = createHash(newPassword);
        await userService.updatePassword(user, newPasswordHash);
        req.logger.info("Contraseña actualizada con éxito");
        return res.status(200).redirect("/");
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const logger = (req, res) => {
    try {
        req.logger.fatal("Fatal");
        req.logger.error("Error");
        req.logger.warning("Warning");
        req.logger.info("Info");
        req.logger.http("HTTP");
        req.logger.debug("Debug");
        res.status(200).send({ test: "Logger test" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};