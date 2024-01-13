import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import { PORT, MONGO_URL, MONGO_DBNAME, SECRET } from "./config/config.js";
import initializePassport from "./config/passport.config.js";
import viewsRouter from "./routes/views.router.js";
import sessionRouter from "./routes/session.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import messageModel from "./dao/models/messages.model.js";
import __dirname from "./utils.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.engine("hbs", handlebars.engine({ extname: ".hbs" }));
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

app.use(session({
    secret: SECRET,
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

mongoose.connect(MONGO_URL, { dbName: MONGO_DBNAME })
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