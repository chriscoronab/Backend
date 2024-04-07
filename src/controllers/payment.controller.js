import Stripe from "stripe";
import { cartService } from "../services/index.js";
import config from "../config/config.js";

const stripe = new Stripe(config.stripeSecretKey);

export const createPayment = async (req, res) => {
    try {
        const cid = req.user.cart;
        const cart = await cartService.getCartByID(cid);
		if (!cart) {
            req.logger.error(`El carrito con ID ${cid} no existe`);
            return res.status(404).send({ error: `El carrito con ID ${cid} no existe` });
        };
        const lineItems = cart.products.map(prod => {
            const price = Math.round(prod.product.price * 100);
            return {
                price_data: {
                    product_data: {
                        name: prod.product.title,
                        description: prod.product.description
                    },
                    currency: "ars",
                    unit_amount: price
                },
                quantity: prod.quantity
            }
        });
        const sessions = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: "payment",
            success_url: `${config.serverURL}/carts/${cid}/purchase`,
            cancel_url: `${config.serverURL}/payment/failure`,
        })
        return res.status(201).redirect(sessions.url);
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const paymentFailure = async (req, res) => {
    try {
        res.status(400).render("paymentFailure", {});
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};