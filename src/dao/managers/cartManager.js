import fs from "fs";
import ProductManager from "./productManager.js"

const productManager = new ProductManager();

export default class CartManager {
    constructor() {
        this.path = "./src/files/carts.json";
        this.format = "utf-8";
        this.carts = [];
    };
    createCart = async () => {
        try {
            const carts = await this.getCarts();
            const cart = {
                id: carts.length + 1,
                products: []
            };
            carts.push(cart);
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, "\t"));
            this.carts = carts;
            return cart;
        } catch (error) {
            return `No se pudo crear el carrito`;
        };
    };
    getCarts = async () => {
        try {
            const data = await fs.promises.readFile(this.path, this.format);
            this.carts = JSON.parse(data);
            return this.carts;
        } catch (error) {
            return `File not found`;
        };
    };
    getCartByID = async (cid) => {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(c => c.id === cid);
            return cart;
        } catch (error) {
            return `Not found`;
        };
    };
    addProductToCart = async (cid, pid) => {
        try {
            let carts = await this.getCarts();
            const cart = await this.getCartByID(cid);
            if (!cart) return null;
            const producto = await productManager.getProductByID(pid);
            if (!producto) return null;
            const existingProduct = cart.products.find(item => item.product === pid);
            if (existingProduct) {
                existingProduct.quantity++;  
            } else {
                const product = {
                    product: pid,
                    quantity: 1,
                };
                cart.products.push(product);
            };
            const cartIndex = carts.findIndex(c => c.id === cid);
            if (cartIndex !== -1) {
                carts[cartIndex] = cart;
            };
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
            return cart;
        } catch (error) {
            return `No se pudo agregar el producto al carrito`;
        };
    };
};