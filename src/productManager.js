import fs from "fs";

export default class ProductManager {
    constructor() {
        this.path = "./src/products.json";
        this.format = "utf-8";
        this.products = [];
    };
    validateCode = async (code) => {
        const data = await fs.promises.readFile(this.path, this.format);
        this.products = JSON.parse(data);
        return this.products.some(producto => producto.code === code);
    };
    getProducts = async (limit) => {
        try {
            if (!fs.existsSync(this.path)) return this.products;
            const data = await fs.promises.readFile(this.path, this.format);
            this.products = JSON.parse(data);
            const productsFiltered = limit ? this.products.slice(0, limit) : this.products;
            return productsFiltered;
        } catch (error) {
            return error;
        };
    };
    addProduct = async (prod) => {
        try {
            const { title, description, price, thumbnail, code, stock } = prod;
            if(!fs.existsSync(this.path)) {
                if(!title || !description || !price || !thumbnail || !code || !stock) return `Campo incompleto`;
                const product = {
                    id: this.products.length + 1,
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock
                };
                this.products.push(product);
                await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, "\t"));
                return `Producto ${code} agregado con éxito`;
            };
            const data = await fs.promises.readFile(this.path, this.format);
            this.products = JSON.parse(data);
            if(!title || !description || !price || !thumbnail || !code || !stock ) return `Campo incompleto`;
            const validate = await this.validateCode(code);
            if (validate) return `Error. Este código ${code} se encuentra repetido.`;
            const product = {
                id: this.products.length + 1,
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            };
            this.products.push(product);
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, "\t"));
            return `Producto ${code} agregado con éxito`;
        } catch (error) {
            return `No se pudo agregar el producto`;
        };
    };
    getProductByID = async (id) => {
        try {
            const data = await fs.promises.readFile(this.path, this.format);
            this.products = JSON.parse(data);
            const producto = this.products.find(product => product.id === id);
            if (producto) return producto;
        } catch (error) {
            return `Not found`;
        };
    };
    updateProduct = async (id, update) => {
        try {
            const data = await fs.promises.readFile(this.path, this.format);
            this.products = JSON.parse(data);
            const index = this.products.findIndex(producto => producto.id === id);
            if (index) {
                this.products[index] = {...this.products[index], ...update};
                await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, "\t"));
                return `Producto ${id} actualizado con éxito`;
            };
        } catch (error) {
            return `Error al actualizar el producto ${id}`;
        };
    };
    deleteProduct = async (id) => {
        try {
            const data = await fs.promises.readFile(this.path, this.format);
            this.products = JSON.parse(data);
            const producto = this.products.find(p => p.id === id);
            if (!producto) return `No existe un producto con el ID ${id}`;
            const filter = this.products.filter(product => product.id !== id);
            await fs.promises.writeFile(this.path, JSON.stringify(filter, null, "\t"));
            return `Producto ${id} eliminado exitosamente`;   
        } catch (error) {
            return `No se pudo eliminar el producto ${id}`;
        };
    };
};