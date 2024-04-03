import { v4 as uuidv4 } from "uuid";
import { cartService, productService, ticketService } from "../services/index.js";
import { sendTicketMail } from "../config/nodemailer.js";

export const getCarts = async (req, res) => {
    try {
        const carts = await cartService.getCarts();
        return res.status(200).send({ status: "success", payload: carts });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const postCart = async (req, res) => {
    try {
        const newCart = req.body;
        const cart = await cartService.createCart(newCart);
        return res.status(201).send({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const cartRender = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartService.getCartByID(cid);
        if (!cart) {
            req.logger.error(`El carrito con ID ${cid} no existe`);
            return res.status(404).send({ error: `El carrito con ID ${cid} no existe` });
        };
        const userCart = req.user.cart;
        const productsInCart = cart.products.length > 0 ? true : false;
        return res.status(200).render("cart", { cart, userCart, productsInCart });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const putCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const carrito = req.body;
        const cart = await cartService.getCartByID(cid);
        if (!cart) {
            req.logger.error(`El carrito con ID ${cid} no existe`);
            return res.status(404).send({ error: `El carrito con ID ${cid} no existe` });
        };
        cart.products = carrito;
        const updatedCart = await cartService.updateCart(cid, cart);
        req.logger.info("Carrito actualizado con éxito");
        return res.status(200).send({ status: "success", payload: updatedCart });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const deleteProductsCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartService.deleteAllCartProducts(cid);
        if (!cart) {
            req.logger.error(`El carrito con ID ${cid} no existe`);
            return res.status(404).send({ error: `El carrito con ID ${cid} no existe` });
        };
        req.logger.info("Productos eliminados del carrito con éxito");
        return res.status(200).send({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const postProductCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const { pid } = req.params;
        const cart = await cartService.getCartByID(cid);
        const product = await productService.getProductByID(pid);
        if (!cart || !product) {
            req.logger.error("El carrito o producto no existe");
            return res.status(404).send({ error: "El carrito o producto no existe" });
        };
        const user = req.user;
        if (user.role === "Premium") {
            const validOwner = user.email === product.owner;
            if (validOwner) {
                req.logger.warning("No puedes agregar al carrito un producto creado por ti");
                return res.status(403).send({ error: "No puedes agregar al carrito un producto creado por ti" });
            };
        };
        const productAdded = await cartService.addProductToCart(cid, pid);
        req.logger.info("Producto agregado al carrito con éxito");
        return res.status(200).send({ status: "success", payload: productAdded });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const putProductCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const { pid } = req.params;
        const newQuantity = req.body.quantity;
        if (isNaN(newQuantity) || newQuantity < 0) {
            req.logger.warning("La cantidad debe ser un número mayor a 0");
            return res.status(400).send({ error: "La cantidad debe ser un número mayor a 0" });
        };
        const cart = await cartService.getCartByID(cid);
        const product = cart.products.find(item => item.product._id == pid);
        if (!cart || !product) {
            req.logger.error("Carrito o producto no existe");
            return res.status(404).send({ error: "Carrito o producto no existe" });
        };
        product.quantity = newQuantity;
        const updatedCart = await cartService.updateCart(cid, cart);
        req.logger.info("Cantidad del producto actualizada con éxito");
        return res.status(200).send({ status: "success", payload: updatedCart });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const deleteProductCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const { pid } = req.params;
        const cart = await cartService.deleteCartProduct(cid, pid);
        if (!cart) {
            req.logger.error(`El carrito con ID ${cid} no existe`);
            return res.status(404).send({ error: `El carrito con ID ${cid} no existe` });
        };
        req.logger.info("Producto eliminado del carrito con éxito");
        return res.status(200).send({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

const calculateTotalAmount = async cart => {
    let total = 0;
    for (const item of cart) {
        const product = await productService.getProductByID(item.product);
        if (!product) return req.logger.error(`El producto con ID ${item.product} no existe`);
        total += product.price * item.quantity;
    };
    total = Number(total.toFixed(2));
    return total;
};

export const purchase = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartService.getCartByID(cid);
        if (!cart) {
            req.logger.error(`El carrito con ID ${cid} no existe`);
            return res.status(404).send({ error: `El carrito con ID ${cid} no existe` });
        };
        const userEmail = req.user.email;
        const approvedProducts = [];
        const rejectedProducts = [];
        for (const item of cart.products) {
            const product = await productService.getProductByID(item.product._id);
            if (!product || product.stock === 0 || product.stock < item.q0uantity) {
                rejectedProducts.push(item);
                continue;
            };
            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await productService.updateProduct(product._id, product);
                approvedProducts.push(item);
            };
        };
        if (approvedProducts.length > 0) {
            const newTicket = {
                code: uuidv4(),
                purchase_datetime: new Date(),
                amount: await calculateTotalAmount(approvedProducts),
                purchaser: userEmail,
                products: approvedProducts.map(prod => ({ product: prod.product._id, quantity: prod.quantity })),
                rejected_products: rejectedProducts.map(p => ({ product: p.product._id, quantity: p.quantity }))
            };
            const saveTicket = await ticketService.createTicket(newTicket);
            const ticket = await ticketService.getTicketByID(saveTicket._id);
            const notPurchased = rejectedProducts.length > 0 ? true : false;
            await sendTicketMail(userEmail, ticket);
            req.logger.info("Compra realizada con éxito");
            return res.status(200).render("ticket", { ticket, notPurchased });
        } else {
            req.logger.error("La compra no pudo ser procesada por falta de stock");
            return res.status(400).send({ error: "La compra no pudo ser procesada por falta de stock" });
        };
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};