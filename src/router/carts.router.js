import { Router } from "express";
import CartManager from "../managers/cartManager.js";

const router = Router();

const cartManager = new CartManager();

router.get("/", async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.json(carts);
    } catch (error) {
        res.status(500).send({ error: "Error al obtener los carritos" });
    };
});

router.get("/:cid", async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const cart = await cartManager.getCartByID(cid);
        res.json(cart);
    } catch (error) {
        res.status(404).send({ error: "Cart not found" });
    };
});

router.post("/", async (req, res) => {
    try {
        const cart = await cartManager.createCart();
        res.json(cart);
    } catch (error) {
        res.status(500).send({ error: "Error al crear el carrito" });
    };
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const pid = parseInt(req.params.pid);
        const product = await cartManager.addProductToCart(cid, pid);
        res.json(product);
    } catch (error) {
        res.status(500).send({ error: "Error al agregar el producto al carrito" });
    };
});

export default router;