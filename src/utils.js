import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "./config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const createHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
};

export const generateToken = user => {
    return jwt.sign({ user }, config.privateKey, { expiresIn: "24h" });
};

export function publicAccess(req, res, next) {
    if (req.session.user) return res.status(200).redirect("/session/current");
    next();
};

export function authentication(req, res, next) {
    if (!req.user) return res.status(401).redirect("/");
    next();
};

export const authorization = (...allowedRoles) => {
    return async (req, res, next) => {
        const user = req.user;
        if (!user) return res.status(401).redirect("/");
        if (!allowedRoles.includes(user.role)) return res.status(403).send({ error: "No permisions" });
        return next();
    };
};

export const generateEmailToken = email => {
    return jwt.sign({ email }, config.emailKey, { expiresIn: "1h" });
};

export const verifyEmailToken = token => {
    return jwt.verify(token, config.emailKey);
};