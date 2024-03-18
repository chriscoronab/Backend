import { userService } from "../services/index.js";

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