import express from "express";
import ProductManager from "./productManager.js";

const app = express();
const productManager = new ProductManager();

app.get("/products", async (req, res) => {
    try {
        const limit = parseInt(req.query?.limit);
        const products = await productManager.getProducts(limit);
        res.json({ products });
    } catch (error) {
        res.status(500).send(error);
    };
});

app.get("/products/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const product = await productManager.getProductByID(id);
    if (!product) return res.send({ error: "Product not found" });
    res.send({ product });
});

app.listen(8080, () => console.log("Listening on port..."));