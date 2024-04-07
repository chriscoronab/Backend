import cartModel from "./models/carts.model.js";
import productModel from "./models/products.model.js";

export default class CartManager {
    constructor() {
        this.model = cartModel;
    };
    getCarts = async () => {
        try {
            return this.model.find();
        } catch (error) {
            console.error(error);
        };
    };
    createCart = async cart => {
        try {
            return await this.model.create(cart);
        } catch (error) {
            console.error(error);
        };
    };
    getCartByID = async cid => {
        try {
            return await this.model.findOne({ _id: cid }).lean();
        } catch (error) {
            console.error(error);
        };
    };
    updateCart = async (cid, update) => {
        try {
            return await this.model.updateOne({ _id: cid }, update);
        } catch (error) {
            console.error(error);
        };
    };
    deleteAllCartProducts = async cid => {
        try {
            const cart = await this.getCartByID(cid);
            cart.products.splice(0, cart.products.length);
            return await this.updateCart(cid, cart);
        } catch (error) {
            console.error(error);
        };
    };
    addProductToCart = async (cid, pid) => {
        try {
            const cart = await this.getCartByID(cid);
            const producto = cart.products.find(item => item.product._id == pid);
            if (!producto) {
                cart.products.push({ product: pid, quantity: 1 });
            } else {
                producto.quantity++;
            };
            return await this.updateCart(cid, cart);
        } catch (error) {
            console.error(error);
        };
    };
    deleteCartProduct = async (cid, pid) => {
        try {
            const cart = await this.getCartByID(cid);
            const product = cart.products.find(item => item.product._id == pid);
            if (!product) return null;
            cart.products.splice(product, 1);
            return await this.updateCart(cid, cart);
        } catch (error) {
            console.error(error);
        };
    };
    calculateTotalAmount = async cart => {
        try {
            let total = 0;
            for (const item of cart) {
                const product = await productModel.findOne({ _id: item.product }).lean().exec();
                product.price *= item.quantity;
                total += product.price;
            };
            return total;
        } catch (error) {
            console.error(error);
        };
    };
};