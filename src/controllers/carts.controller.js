import { v4 as uuidv4 } from "uuid";
import { cartService, productService, ticketService } from "../services/index.js";
import transport from "../config/nodemailer.js";

export const getCarts = async (req, res) => {
    try {
        const carts = await cartService.getCarts();
        res.status(200).send({ status: "success", payload: carts });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const postCart = async (req, res) => {
    try {
        const newCart = req.body;
        const cart = await cartService.createCart(newCart);
        res.status(200).send({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const cartRender = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartService.getCartByID(cid);
        if (!cart) return res.status(404).send({ error: `El carrito con ID ${cid} no existe` });
        if (cart.products.length > 0) {
            return res.status(200).render("cart", { cart });
        } else {
            return res.status(200).render("emptyCart", { cart });
        };
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const postProductCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const { pid } = req.params;
        const cart = await cartService.addProductToCart(cid, pid);
        if (!cart) return res.status(404).send({ error: `El carrito con ID ${cid} no existe` });
        res.status(200).send({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const putCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const carrito = req.body;
        const cart = await cartService.getCartByID(cid);
        if (!cart) return res.status(404).send({ error: `El carrito con ID ${cid} no existe` });
        cart.products = carrito;
        const updatedCart = await cartService.updateCart(cid, cart);
        res.status(200).send({ status: "success", payload: updatedCart });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const putProductCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const { pid } = req.params;
        const newQuantity = req.body.quantity;
        if (newQuantity < 0) return res.status(400).send({ error: "La cantidad debe ser mayor a 0" });
        const cart = await cartService.getCartByID(cid);
        const product = cart.products.find(item => item.product._id == pid);
        if (!cart || !product) return res.status(404).send({ error: "Carrito o producto no existe" });
        product.quantity = newQuantity;
        const updatedCart = await cartService.updateCart(cid, cart);
        res.status(200).send({ status: "success", payload: updatedCart });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const deleteProductCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const { pid } = req.params;
        const cart = await cartService.deleteCartProduct(cid, pid);
        if (!cart) return res.status(404).send({ error: `El carrito con ID ${cid} no existe` });
        res.status(200).send({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const deleteProductsCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartService.deleteAllCartProducts(cid);
        if (!cart) return res.status(404).send({ error: `El carrito con ID ${cid} no existe` });
        res.status(200).send({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const purchase = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartService.getCartByID(cid);
        const userEmail = req.user.email;
        console.log(userEmail);
        let total = 0;
        if (cart) {
            if (!cart.products.length) return res.send({ error: "Es necesario que agregues productos al carrito" });
            const ticketProducts = [];
            const rejectedProducts = [];
            for (let i = 0; i < cart.products.length; i++) {
                const cartProduct = cart.products[i];
                const product = await productService.getProductByID(cartProduct.product._id);
                if (cartProduct.quantity <= product[0].stock) {
                    ticketProducts.push({
                        pid: cartProduct._id,
                        price: cartProduct.product.price
                    });
                    total += parseInt(cartProduct.quantity) * parseInt(product[0].price);
                    await productService.updateStock(cartProduct._id, parseInt(cartProduct.product.stock) - parseInt(cartProduct.quantity));
                } else {
                    rejectedProducts.push(cartProduct._id);
                };
            };
            const newTicket = {
                code: uuidv4(),
                purchase_datetime: new Date().toLocaleDateString(),
                amount: parseInt(total),
                purchaser: userEmail,
                products: ticketProducts
            };
            const ticket = await ticketService.createTicket(newTicket);
            await cartService.updateCart(cid, cart);
            console.log(ticket);
            if (ticket) {
                try {
                    const mail = await transport.sendMail({
                        from: "Flow NBA",
                        to: "userEmail",
                        subject: "Compra realizada",
                        html: `<div>
                            <h2>${req.user.first_name}, tu compra fue realizada con éxito</h2>
                            <p><strong>Monto total:</strong> ${total}</p>
                        </div>`
                    });
                    console.log(mail);
                    res.status(200).send({ status: "success", payload: ticket });
                } catch (error) {
                    res.status(500).send({ error: "Hubo un error al enviar el correo" });
                };
            };
        } else {
            return res.status(404).send({ error: `El carrito con ID ${cid} no existe` });
        };
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};