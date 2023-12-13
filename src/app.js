import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import viewsRouter from "./routes/views.router.js";
import sessionRouter from "./routes/session.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import chatRouter from "./routes/chat.router.js";
import messageModel from "./dao/models/messages.model.js";
import initializePassport from "./config/passport.config.js";
import __dirname from "./utils.js";

const app = express();
const PORT = process.env.PORT || 8080;
const mongoURL = "mongodb+srv://chriscoronab:Chris1995@clusterchris.yhwrcmd.mongodb.net/";
const mongoDB = "ecommerce";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("hbs", handlebars.engine({ extname: ".hbs" }));
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

app.use(session({
    store: MongoStore.create({
        mongoUrl: mongoURL,
        dbName: mongoDB
    }),
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + "/public"));

app.use("/", viewsRouter);
app.use("/session", sessionRouter);
app.use("/products", productsRouter);
app.use("/carts", cartsRouter);
app.use("/chat", chatRouter);

mongoose.connect(mongoURL, { dbName: mongoDB })
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