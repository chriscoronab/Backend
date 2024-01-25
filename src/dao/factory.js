import mongoose from "mongoose";
import config from "../config/config.js";

export let Products;
export let Carts;
export let Users;
export let Messages;

console.log(`Persistence with ${config.persistence}`);

switch (config.persistence) {
    case "MONGO":
        mongoose.connect(config.mongoURL, { dbName: config.mongoDBName })
            .then(() => { console.log("DB connected") })
            .catch(error => { console.error("Error connecting to DB") })
        const { default: ProductsMongo } = await import("./mongo/products.mongo.js");
        const { default: CartsMongo } = await import("./mongo/carts.mongo.js");
        const { default: UsersMongo } = await import("./mongo/users.mongo.js");
        const { default: MessagesMongo } = await import("./mongo/messages.mongo.js");
        Products = ProductsMongo;
        Carts = CartsMongo;
        Users = UsersMongo;
        Messages = MessagesMongo;
        break;
    default:
        throw new Error("Persistence not recognized");
};