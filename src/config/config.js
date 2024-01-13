import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT;
export const MONGO_URL = process.env.MONGO_URL;
export const MONGO_DBNAME = process.env.MONGO_DBNAME;
export const SECRET = process.env.SECRET;
export const CLIENT_ID = process.env.CLIENT_ID;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
export const PRIVATE_KEY = process.env.PRIVATE_KEY;