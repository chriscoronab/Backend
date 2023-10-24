import fs from "fs";
import ProductManager from "./productManager.js"

const productManager = new ProductManager();

export default class CartManager {
    constructor() {
        this.path = "./src/db/carts.json";
        this.format = "utf-8";
        this.carts = [];
    };
    createCart = async () => {
        try {
            if (!fs.existsSync(this.path)) {
                const cart = {
                    id: this.carts.length + 1,
                    products: []
                };
                this.carts.push(cart);
                await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, "\t"));
                return `Carrito creado con éxito`;
            };
            const data = await fs.promises.readFile(this.path, this.format);
            this.carts = JSON.parse(data);
            const cart = {
                id: this.carts.length + 1,
                products: []
            };
            this.carts.push(cart);
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, "\t"));
            return `Carrito creado exitosamente`;
        } catch (error) {
            return error;
        };
    };
    getCarts = async () => {
        try {
            if (!fs.existsSync(this.path)) return this.carts;
            const data = await fs.promises.readFile(this.path, this.format);
            this.carts = JSON.parse(data);
            return this.carts;
        } catch (error) {
            return error;
        };
    };
    getCartByID = async (cid) => {
        try {
            const data = await fs.promises.readFile(this.path, this.format);
            this.carts = JSON.parse(data);
            const carrito = this.carts.find(cart => cart.id === cid);
            if (carrito) return carrito;
        } catch (error) {
            return error;
        };
    };
    addProductToCart = async (cid, pid) => {
        try {
            const data = await fs.promises.readFile(this.path, this.format);
            this.carts = JSON.parse(data);
            const carrito = this.carts.find(cart => cart.id === cid);
            const product = await productManager.getProductByID(pid);
            if (product === `Not found`) return `Product not found`;
            if (!carrito) return `Cart not found`;
            const producto = carrito.products.find(p => p.id === pid);
            if (!producto) {
                carrito.products.push({ pid: pid, quantity: 1 });
            } else {
                producto.quantity ++;
            };
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, "\t"));
            return `Producto agregado al carrito exitosamente`;
        } catch (error) {
            return error;
        };
    };
};