import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import chatRouter from "./routes/chat.router.js";
import messageModel from "./dao/models/messages.model.js";
import __dirname from "./utils.js";

const app = express();
const PORT = process.env.PORT || 8080;
const mongoURL = "mongodb+srv://chriscoronab:Chris1995@clusterchris.yhwrcmd.mongodb.net/";
const mongoDBName = "ecommerce";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => res.status(200).render("index", {
    style: "index.css"
}));
app.use("/products", productsRouter);
app.use("/carts", cartsRouter);
app.use("/chat", chatRouter);

mongoose.connect(mongoURL, { dbName: mongoDBName })
    .then(() => {
        console.log("DB connected");
        const httpServer = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
        httpServer.on("Error", error => console.log(`${error.message}`));
        const io = new Server(httpServer);
        io.on("connection", async socket => {
            console.log("New user connected");
            let messages = (await messageModel.find()) ? await messageModel.find() : [];
            socket.broadcast.emit("alert");
            socket.emit("logs", messages);
            socket.on("message", data => {
                messages.push(data);
                messageModel.create(messages);
                io.emit("logs", messages);
            });
        });
    })
    .catch (error => {
        console.error("Error connecting to DB");
    })