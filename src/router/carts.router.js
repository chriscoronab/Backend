import { Router } from "express";
import CartManager from "../managers/cartManager.js";

const router = Router();

const cartManager = new CartManager();

router.get("/", async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.send(carts);
    } catch (error) {
        res.status(500).send("Error al obtener los carritos " + error);
    };
});

router.get("/:cid", async (req, res) => {
    try {
        const id = parseInt(req.params.cid);
        const cart = await cartManager.getCartByID(id);
        res.send(cart);
    } catch (error) {
        res.status(404).send("Cart not found " + error);
    };
});

router.post("/", async (req, res) => {
    try {
        const cart = await cartManager.createCart();
        res.send(cart);
    } catch (error) {
        res.status(500).send("Error al crear el carrito " + error);
    };
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const pid = parseInt(req.params.pid);
        const product = await cartManager.addProductToCart(cid, pid);
        res.send(product);
    } catch (error) {
        res.status(500).send("Error al agregar el producto al carrito " + error);
    };
});

export default router;