import { Router } from "express";
import CartManager from "../dao/managers/db/cartManager.js";

const router = Router();
const cartManager = new CartManager();

router.get("/", async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.status(200).send({ status: "success", payload: carts });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

router.post("/", async (req, res) => {
    try {
        const newCart = req.body;
        const cart = await cartManager.createCart(newCart);
        res.status(200).send({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

router.get("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartByID(cid);
        if (!cart) return res.status(404).send({ error: `El carrito con ID ${cid} no existe` });
        console.log(JSON.stringify(cart));
        if (cart.products.length > 0) {
            return res.status(200).render("cart", { cart });
        } else {
            return res.status(200).render("emptyCart", { cart });
        };
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

router.post("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid } = req.params;
        const { pid } = req.params;
        const cart = await cartManager.addProductToCart(cid, pid);
        if (!cart) return res.status(404).send({ error: `El carrito con ID ${cid} no existe` });
        res.status(200).send({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

router.put("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const carrito = req.body;
        const cart = await cartManager.getCartByID(cid);
        if (!cart) return res.status(404).send({ error: `El carrito con ID ${cid} no existe` });
        cart.products = carrito;
        const updatedCart = await cartManager.updateCart(cid, cart);
        res.status(200).send({ status: "success", payload: updatedCart });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid } = req.params;
        const { pid } = req.params;
        const newQuantity = req.body.quantity;
        if (newQuantity < 0) return res.status(400).send({ error: `La cantidad debe ser mayor a 0` });
        const cart = await cartManager.getCartByID(cid);
        const product = cart.products.find(item => item.product._id == pid);
        if (!cart || !product) return res.status(404).send({ error: `Carrito o producto no existe` });
        product.quantity = newQuantity;
        const updatedCart = await cartManager.updateCart(cid, cart);
        res.status(200).send({ status: "success", payload: updatedCart });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid } = req.params;
        const { pid } = req.params;
        const cart = await cartManager.deleteCartProduct(cid, pid);
        if (!cart) return res.status(404).send({ error: `El carrito con ID ${cid} no existe` });
        res.status(200).send({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

router.delete("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.deleteAllCartProducts(cid);
        if (!cart) return res.status(404).send({ error: `El carrito con ID ${cid} no existe` });
        res.status(200).send({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

export default router;