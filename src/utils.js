import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config({ path: ".env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PRIVATE_KEY = process.env.PRIVATE_KEY;

export default __dirname;

export const createHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
};

export const generateToken = user => {
    return jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "24h" });
};

export const authorization = role => {
    return async (req, res, next) => {
        const user = req.user;
        if (!user) return res.status(401).redirect("/");
        if (user.role != role) return res.status(403).send({ error: "No permisions" });
        return next();
    };
};