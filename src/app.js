import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import viewsRouter from "./router/views.router.js";
import productsRouter from "./router/products.router.js";
import cartsRouter from "./router/carts.router.js";
import __dirname from "./utils.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => res.status(200).render("index", {
    name: "Chucho",
    style: "index.css"
}));
app.use("/home", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

const PORT = process.env.PORT || 8080;
const httpServer = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
httpServer.on("Error", error => console.log(`${error.message}`));
const io = new Server(httpServer);

io.on("connection", socket => {
    console.log("New user connected");
    socket.on("productsList", data => {
        io.emit("updatedProducts", data);
    });
});