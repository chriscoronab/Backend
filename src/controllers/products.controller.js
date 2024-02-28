import { productService } from "../repositories/index.js";

export const productsRender = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = req.query.page || 1;
        if (isNaN(page) || page <= 0 || page > 3) {
            req.logger.error("La página solicitada no existe");
            return res.status(404).send({ error: "La página solicitada no existe" });
        };
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
        const products = await productService.paginate(filter, options);
        products.payload = products.docs;
        return res.status(200).render("products", products);
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

export const postProduct = async (req, res) => {
    try {
        const newProduct = req.body;
        const product = await productService.addProduct(newProduct);
        const user = req.user;
        if (user.role === "Premium") {
            product.owner = user.email;
            await productService.updateProduct({ _id: product._id }, product);
        };
        req.logger.info("Producto creado con éxito");
        return res.status(201).redirect("/products");
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const productRender = async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productService.getProductByID(pid);
        if (!product) {
            req.logger.error(`El producto con ID ${pid} no existe`);
            return res.status(404).send({ error: `El producto con ID ${pid} no existe` });
        };
        const cart = req.user.cart;
        return res.status(200).render("detail", { product, cart });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const putProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const producto = req.body;
        const product = await productService.getProductByID(pid);
        if (!product) {
            req.logger.error(`El producto con ID ${pid} no existe`);
            return res.status(404).send({ error: `El producto con ID ${pid} no existe` });
        };
        const user = req.user;
        if (user.role === "Premium") {
            const validOwner = user.email === product.owner;
            if (!validOwner) {
                req.logger.warning("No estás autorizado para actualizar este producto");
                return res.status(403).send({ error: "No estás autorizado para actualizar este producto" });
            };
        };
        const updatedProduct = await productService.updateProduct(pid, producto);
        req.logger.info("Producto actualizado con éxito");
        return res.status(200).send({ status: "success", payload: updatedProduct });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

export const deleteProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productService.getProductByID(pid);
        if (!product) {
            req.logger.error(`El producto con ID ${pid} no existe`);
            return res.status(404).send({ error: `El producto con ID ${pid} no existe` });
        };
        const user = req.user;
        if (user.role === "Premium") {
            const validOwner = user.email === product.owner;
            if (!validOwner) {
                req.logger.warning("No estás autorizado para eliminar este producto");
                return res.status(403).send({ error: "No estás autorizado para eliminar este producto" });
            };
        };
        const deletedProduct = await productService.deleteProduct(product);
        req.logger.info("Producto eliminado con éxito");
        return res.status(200).send({ status: "success", payload: deletedProduct });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};