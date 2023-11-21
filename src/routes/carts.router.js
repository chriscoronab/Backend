import { Router } from "express";
import CartManager from "../dao/managers/dbCartManager.js";

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

router.post("/", async (req, res) => {
    try {
        const newCart = req.body;
        const cart = await cartManager.createCart(newCart);
        res.status(200).send({ status: "success", cart });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

router.get("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartByID(cid);
        if (!cart) return res.status(404).json({ error: `El carrito con ID ${cid} no existe` });
        res.status(200).send({ cart });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid } = req.params;
        const { pid } = req.params;
        const cart = await cartManager.addProductToCart(cid, pid);
        if (!cart) return res.status(404).json({ error: `El carrito con ID ${cid} no existe` });
        res.status(200).send({ status: "success", cart });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

router.delete("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.deleteCart(cid);
        if (!cart) return res.status(404).json({ error: `El carrito con ID ${cid} no existe` });
        res.status(200).send({ status: "success", cart });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

router.delete("/:cid/products", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.deleteAllCartProducts(cid);
        if (!cart) return res.status(404).json({ error: `El carrito con ID ${cid} no existe` });
        res.status(200).send({ status: "success", cart });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

export default router;