import { userService } from "../services/index.js";
import UserDTO from "../dto/users.dto.js";
import { sendDeletedUserMail } from "../config/nodemailer.js";

export const getUsers = async (req, res) => {
    try {
        const users = await userService.getUsers();
        const usersDTO = users.map(user => new UserDTO(user));
        return res.status(200).render("users", { usersDTO });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const deleteInactiveUsers = async (req, res) => {
    try {
        const users = await userService.getUsers();
        const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
        let deletedUsers = 0;
        for (const user of users) {
            if (user.last_connection < twoDaysAgo && user.role !== "Admin") {
                await userService.deleteUser(user._id);
                await sendDeletedUserMail(user);
                deletedUsers++;
            };
        };
        if (deletedUsers === 0) {
            req.logger.info("No hay usuarios inactivos")
            return res.status(200).send({ status: "success", message: "No hay usuarios inactivos" });
        };
        req.logger.info(`${deletedUsers} usuarios inactivos eliminados con éxito`);
        return res.status(200).send({ status: "success", message: `${deletedUsers} usuarios inactivos eliminados con éxito` });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const deleteUser = async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await userService.getUserByID(uid);
        if (!user) {
            req.logger.error(`El usuario con ID ${uid} no existe`);
            return res.status(404).send({ error: `El usuario con ID ${uid} no existe` });
        };
        if (user.role === "Admin") {
            req.logger.error("No es posible eliminar la cuenta del Admin");
            return res.status(403).send({ error: "No es posible eliminar la cuenta del Admin" });
        };
        const deletedUser = await userService.deleteUser(uid);
        req.logger.info("El usuario fue eliminado con éxito");
        return res.status(200).send({ status: "success", payload: deletedUser });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const userToggle = async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await userService.getUserByID(uid);
        if (!user) {
            req.logger.error(`El usuario con ID ${uid} no existe`);
            return res.status(404).send({ error: `El usuario con ID ${uid} no existe` });
        };
        if (user.role === "User") {
            user.role = "Premium";
        } else if (user.role === "Premium") {
            user.role = "User";
        } else {
            req.logger.error("No es posible cambiar el rol del Admin");
            return res.status(403).send({ error: "No es posible cambiar el rol del Admin" });
        };
        const updatedUser = await userService.updateUser(uid, user);
        req.logger.info(`El usuario ${user.email} cambió su rol a ${user.role}`);
        return res.status(200).send({ status: "success", payload: updatedUser });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};