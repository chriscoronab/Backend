import { Router } from "express";
import ProductManager from "../managers/productManager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
    try {
        const allProducts = await productManager.getProducts();
        res.render("home", {
            style: "index.css",
            allProducts
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

router.get("/realTimeProducts", async (req, res) => {
    try {
        const allProducts = await productManager.getProducts();
        res.render("realTimeProducts", {
            style: "index.css",
            allProducts
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

export default router;