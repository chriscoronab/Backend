import fs from "fs";

export default class ProductManager {
    constructor() {
        this.path = "./src/db/products.json";
        this.format = "utf-8";
        this.products = [];
    };
    validateCode = async (code) => {
        const products = await this.getProducts();
        return products.some(producto => producto.code === code);
    };
    getProducts = async (limit) => {
        try {
            const data = await fs.promises.readFile(this.path, this.format);
            this.products = JSON.parse(data);
            const productsFiltered = limit ? this.products.slice(0, limit) : this.products;
            return productsFiltered;
        } catch (error) {
            return `File not found`;
        };
    };
    addProduct = async (prod) => {
        try {
            const { title, description, category, price, thumbnail, code, stock } = prod;
            const products = await this.getProducts();
            if (!title || !description || !category || !price || !code || !stock ) return `Todos los campos son requeridos`;
            const validate = await this.validateCode(code);
            if (validate) return `Error. Este código ${code} se encuentra repetido.`;
            const product = {
                id: products.length + 1,
                title,
                description,
                category,
                price,
                thumbnail,
                code,
                stock,
                status: true
            };
            products.push(product);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
            this.products = products;
            return product;
        } catch (error) {
            return `No se pudo agregar el producto`;
        };
    };
    getProductByID = async (id) => {
        try {
            const products = await this.getProducts();
            const producto = products.find(product => product.id === id);
            return producto;
        } catch (error) {
            return `Not found`;
        };
    };
    updateProduct = async (id, update) => {
        try {
            const products = await this.getProducts();
            const index = products.findIndex(producto => producto.id === id);
            if (index) {
                products[index] = { ...products[index], ...update };
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
                this.products = products;
                return `Producto ${id} actualizado con éxito`;
            };
        } catch (error) {
            return `Error al actualizar el producto ${id}`;
        };
    };
    deleteProduct = async (id) => {
        try {
            const products = await this.getProducts();
            const producto = await this.getProductByID(id);
            if (!producto) return `No existe un producto con el ID ${id}`;
            const filter = products.filter(product => product.id !== id);
            await fs.promises.writeFile(this.path, JSON.stringify(filter, null, "\t"));
            this.products = filter;
            return `Producto ${id} eliminado exitosamente`;   
        } catch (error) {
            return `No se pudo eliminar el producto ${id}`;
        };
    };
};