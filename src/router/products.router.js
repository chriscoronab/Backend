import { Router } from "express";
import ProductManager from "../managers/productManager.js";

const router = Router();

const productManager = new ProductManager();

router.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query?.limit);
        const products = await productManager.getProducts(limit);
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

router.get("/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const product = await productManager.getProductByID(pid);
        if (!product) return res.status(404).json({ error: `El producto con ID ${pid} no existe` });
        return res.status(200).json({ product });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

router.post("/", async (req, res) => {
    try {
        const data = req.body;
        const product = await productManager.addProduct(data);
        if (product) {
            const products = await productManager.getProducts();
            req.app.get("socketio").emit("updatedProducts", products);
            return res.status(201).json({ message: `Producto ${product.id} agregado con éxito` });
        }
        return res.status(404).json({ error: "Error al agregar el producto" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

router.put("/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const data = req.body;
        const producto = await productManager.getProductByID(pid);
        if (!producto) return res.status(404).json({ error: `El producto con ID ${pid} no existe` });
        await productManager.updateProduct(pid, data);
        const updatedProducts = await productManager.getProducts();
        req.app.get("socketio").emit("updatedProducts", updatedProducts);
        res.status(200).json({ message: `Producto ${pid} actualizado con éxito` });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

router.delete("/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const producto = await productManager.getProductByID(pid);
        if (!producto) return res.status(404).json({ error: `El producto con ID ${pid} no existe` });
        await productManager.deleteProduct(pid);
        const updatedProducts = await productManager.getProducts();
        req.app.get("socketio").emit("updatedProducts", updatedProducts);
        res.status(200).json({ message: `Producto ${pid} eliminado con éxito` });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

export default router;