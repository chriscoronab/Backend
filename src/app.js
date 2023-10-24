import express from "express";
import routerProducts from "./router/products.router.js";
import routerCarts from "./router/carts.router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static("./src/public"));

app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);

app.listen(8080, () => console.log("Listening on port..."));