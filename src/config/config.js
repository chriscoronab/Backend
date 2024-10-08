import dotenv from "dotenv";
import { opts } from "./commander.js";

dotenv.config();

export default {
    persistence: opts.persistence || "MONGO",
    port: process.env.PORT || 8080,
    serverURL: process.env.SERVER_URL,
    mongoURL: process.env.MONGO_URL,
    mongoDBName: process.env.MONGO_DBNAME,
    secret: process.env.SECRET,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    privateKey: process.env.PRIVATE_KEY,
    emailKey: process.env.EMAIL_KEY,
    nodemailerMail: process.env.NODEMAILER_MAIL,
    nodemailerPassword: process.env.NODEMAILER_PASSWORD,
    nodeEnv: process.env.NODE_ENV,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY
};