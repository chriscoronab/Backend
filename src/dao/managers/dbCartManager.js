import cartModel from "../models/carts.model.js";
import productModel from "../models/products.model.js";

export default class CartManager {
    constructor() {
        this.model = cartModel;
    };
    createCart = async (cart) => {
        try {
            const newCart = await this.model.create(cart);
            return newCart;
        } catch (error) {
            console.error(error);
        };
    };
    getCarts = async () => {
        try {
            return this.model.find();
        } catch (error) {
            console.error(error);
        };
    };
    getCartByID = async (cid) => {
        try {
            const cart = await this.model.findOne({ _id: cid });
            return cart;
        } catch (error) {
            console.error(error);
        };
    };
    addProductToCart = async (cid, pid) => {
        try {
            const cart = await this.getCartByID(cid);
            const producto = await productModel.findById(pid);
            if (!producto) return null;
            const existingProduct = cart.products.find(item => item.product._id == pid);
            if (!existingProduct) {
                cart.products.push({ product: pid, quantity: 1 });
            } else {
                existingProduct.quantity ++;
            };
            const result = await this.updateCart(cid, cart);
            return result;
        } catch (error) {
            console.error(error);
        };
    };
    updateCart = async (cid, update) => {
        try {
            const cart = await this.model.updateOne({ _id: cid }, update);
            return cart;
        } catch (error) {
            console.error(error);
        };
    };
    deleteCart = async (cid) => {
        try {
            const deletedCart = await this.model.deleteOne({ _id: cid });
            return deletedCart;
        } catch {
            console.error(error);
        };
    }
    deleteAllCartProducts = async (cid) => {
        try {
            const cart = await this.getCartByID(cid);
            cart.products.splice(0, cart.products.length);
            const updatedCart = await this.model.updateOne({ _id: cid }, cart);
            return updatedCart;
        } catch {
            console.error(error);
        };
    };
};