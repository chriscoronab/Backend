import { Router } from "express";
import ProductManager from "../dao/managers/dbProductManager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query?.limit);
        const products = await productManager.getProducts(limit);
        res.status(200).render("products", {
            style: "index.css",
            products
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

router.get("/create", async (req, res) => {
    try {
        res.status(200).render("create", {
            style: "index.css"
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

router.post("/create", async (req, res) => {
    try {
        const newProduct = req.body;
        await productManager.addProduct(newProduct);
        res.status(200).redirect("/products");
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

router.get("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductByID(pid);
        if (!product) return res.status(404).json({ error: `El producto con ID ${pid} no existe` });
        res.status(200).render("detail", {
            style: "index.css",
            product
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

router.put("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const product = req.body;
        const updatedProduct = await productManager.updateProduct(pid, product);
        if (!updatedProduct) return res.status(404).json({ error: `El producto con ID ${pid} no existe` });
        return res.status(200).send({ status: "success", updatedProduct });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

router.delete("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.deleteProduct(pid);
        if (!product) return res.status(404).json({ error: `El producto con ID ${pid} no existe` });
        return res.status(200).send({ status: "success", product });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

export default router;