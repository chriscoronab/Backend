import { Router } from "express";
import ProductManager from "../managers/productManager.js";

const router = Router();

const productManager = new ProductManager();

router.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query?.limit);
        const products = await productManager.getProducts(limit);
        res.json(products);
    } catch (error) {
        res.status(500).send({ error: "Error al obtener los productos" });
    };
});

router.get("/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const product = await productManager.getProductByID(pid);
        res.json(product);
    } catch (error) {
        res.status(404).send({ error: "Product not found" });
    };
});

router.post("/", async (req, res) => {
    try {
        const data = req.body;
        const product = await productManager.addProduct(data);
        res.json(product);
    } catch (error) {
        res.status(500).send({ error: "Error al agregar el producto" });
    };
});

router.put("/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const data = req.body;
        const product = await productManager.updateProduct(pid, data);
        res.json(product); 
    } catch (error) {
        res.status(500).send({ error: "Error al actualizar el producto" });
    };
});

router.delete("/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const product = await productManager.deleteProduct(pid);
        res.json(product);
    } catch (error) {
        res.status(500).send({ error: "Error al eliminar el producto" });
    }
});

export default router;