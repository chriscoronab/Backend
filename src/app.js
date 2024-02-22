import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import initializePassport from "./config/passport.config.js";
import logger from "./utils/logger.js";
import viewsRouter from "./routes/views.router.js";
import sessionRouter from "./routes/session.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import usersRouter from "./routes/users.router.js";
import { messageService } from "./repositories/index.js";
import __dirname from "./utils.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());
app.use(logger);

app.engine("hbs", handlebars.engine({ extname: ".hbs" }));
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

app.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/", viewsRouter);
app.use("/session", sessionRouter);
app.use("/products", productsRouter);
app.use("/carts", cartsRouter);
app.use("/users", usersRouter);

const httpServer = app.listen(config.port, () => console.log(`Listening on port ${config.port}`));
httpServer.on("Error", error => console.log(`${error.message}`));

const io = new Server(httpServer);
io.on("connection", async socket => {
    console.log("New user connected");
    let messages = (await messageService.getMessages()) ? await messageService.getMessages() : [];
    socket.broadcast.emit("alert");
    socket.emit("logs", messages);
    socket.on("message", data => {
        messages.push(data);
        messageService.createMessage(messages);
        io.emit("logs", messages);
    });
});