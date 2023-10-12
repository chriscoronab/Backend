class ProductManager {
    constructor(filename) {
        this.path = filename;
        this.format = "utf-8";
        this.products = [];
        this.getProducts();
    };
    validateCode = async (code) => {
        const data = await fs.promises.readFile(this.path, this.format);
        this.products = JSON.parse(data);
        return this.products.some(producto => producto.code === code);
    }
    getProducts = async () => {
        try {
            if (!fs.existsSync(this.path)) return this.products;
            const products = await fs.promises.readFile(this.path, this.format);
            this.products = JSON.parse(products);
            return this.products;
        } catch (error) {
            return error;
        };
    };
    addProduct = async (prod) => {
        try {
            const { title, description, price, thumbnail, code, stock } = prod;
            const product = {
                id: this.products.length + 1,
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            };
            if(!title || !description || !price || !thumbnail || !code || !stock ) return console.error("Campo incompleto");
            // const data = await fs.promises.readFile(this.path, this.format);
            // this.products = JSON.parse(data);
            const validate = await this.validateCode(code);
            if (validate) return console.error("Error. Este código se encuentra repetido.");
            this.products.push(product);
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, "\t"));
            return console.log(`Producto ${code} agregado con éxito`);
        } catch (error) {
            return console.error("No se pudo agregar el producto");
        };
    };
    getProductByID = async (id) => {
        try {
            const data = await fs.promises.readFile(this.path, this.format);
            this.products = JSON.parse(data);
            const producto = this.products.find(product => product.id === id);
            if (producto) return console.log(producto);
        } catch (error) {
            return console.error("Not found");
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
                return console.log("Producto actualizado con éxito");
            };
        } catch (error) {
            return console.error("Error al actualizar el producto");
        };
    };
    deleteProduct = async (id) => {
        try {
            const data = await fs.promises.readFile(this.path, this.format);
            this.products = JSON.parse(data);
            const producto = this.products.find(p => p.id === id);
            if (!producto) return console.log(`No existe un producto con el ID ${id}`);
            const filter = this.products.filter(item => item.id !== id);
            if (this.products.length !== filter.length) {
                await fs.promises.writeFile(this.path, JSON.stringify(filter, null, "\t"));
                return `Producto "${item.title}" eliminado exitosamente`
            }
        } catch (error) {
            return console.error("No se pudo eliminar el producto");
        };
    };
};

const productManager = new ProductManager("./products.json");

const run = async () => {
    productManager.addProduct({
        title: "Chicago Bulls",
        description: "Camiseta Chicago Bulls Nike Icon Edition Swingman - Rojo - Unisex",
        price: "18.500 ARS",
        thumbnail: "Sin imagen",
        code: 19435,
        stock: 15
    });
    productManager.addProduct({
        title: "Boston Celtics",
        description: "Camiseta Boston Celtics Nike Icon Edition Swingman - Verde - Unisex",
        price: "18.500 ARS",
        thumbnail: "Sin imagen",
        code: 54745,
        stock: 12
    });
    productManager.addProduct({
        title: "Los Angeles Lakers",
        description: "Camiseta Los Angeles Lakers Nike Icon Edition Swingman - Amarillo - Unisex",
        price: "18.500 ARS",
        thumbnail: "Sin imagen",
        code: 34657,
        stock: 9
    });
    const result = await productManager.getProducts();
    console.log(result);
};

run();

productManager.getProductByID(1);

productManager.updateProduct(2, {price: "22.000 ARS"});

productManager.deleteProduct(3);

export default ProductManager;