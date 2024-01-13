import ProductManager from "../dao/managers/db/productManager.js";
import productModel from "../dao/models/products.model.js";

const productManager = new ProductManager();

export const productsRender = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = req.query.page || 1;
        if (isNaN(page) || page <= 0 || page > 3) return res.status(404).send({ error: "La página solicitada no existe" });
        const sort = req.query.sort || "";
        const category = req.query.category || "";
        const filter = { ...(category && { category }) };
        let options = {
            limit,
            page: parseInt(page),
            lean: true
        };
        if (sort) {
            options["sort"] = { price: sort === "asc" ? 1 : -1 };
        };
        const products = await productModel.paginate(filter, options);
        products.payload = products.docs;
        res.status(200).render("products", products);
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const createRender = (req, res) => {
    try {
        res.status(200).render("create", {});
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const productRender = async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductByID(pid);
        if (!product) return res.status(404).send({ error: `El producto con ID ${pid} no existe` });
        res.status(200).render("detail", { product });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const postProduct = async (req, res) => {
    try {
        const newProduct = req.body;
        await productManager.addProduct(newProduct);
        res.status(200).redirect("/products");
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const putProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const product = req.body;
        const updatedProduct = await productManager.updateProduct(pid, product);
        if (!updatedProduct) return res.status(404).send({ error: `El producto con ID ${pid} no existe` });
        res.status(200).send({ status: "success", payload: updatedProduct });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const deleteProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.deleteProduct(pid);
        if (!product) return res.status(404).send({ error: `El producto con ID ${pid} no existe` });
        res.status(200).send({ status: "success", payload: product });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};