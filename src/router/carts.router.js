import { Router } from "express";
import CartManager from "../managers/cartManager.js";

const router = Router();

const cartManager = new CartManager();

router.get("/", async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.status(200).json({ carts });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

router.get("/:cid", async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const cart = await cartManager.getCartByID(cid);
        if (!cart) return res.status(404).json({ error: `El carrito con ID ${cid} no existe` });
        res.status(200).json({ cart });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

router.post("/", async (req, res) => {
    try {
        await cartManager.createCart();
        res.status(200).send({ message: "Carrito creado con éxito" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const pid = parseInt(req.params.pid);
        const cart = await cartManager.addProductToCart(cid, pid);
        if (!cart) return res.status(404).json({ error: `El carrito con ID ${cid} no existe` });
        res.status(200).json({ message: `Producto ${pid} agregado al carrito ${cid} con éxito` });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

export default router;