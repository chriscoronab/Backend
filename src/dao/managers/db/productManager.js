import productModel from "../../models/products.model.js";

export default class ProductManager {
    constructor() {
        this.model = productModel;
    };
    getProducts = async () => {
        try {
            const products = await this.model.find();
            return products;
        } catch (error) {
            console.error(error);
        };
    };
    addProduct = async (product) => {
        try {
            const newProduct = await this.model.create(product);
            return newProduct;
        } catch (error) {
            console.error(error);
        };
    };
    getProductByID = async (pid) => {
        try {
            const product = await this.model.findOne({ _id: pid }).lean().exec();
            return product;
        } catch (error) {
            console.error(error);
        };
    };
    updateProduct = async (pid, update) => {
        try {
            const product = await this.model.updateOne({ _id: pid }, update);
            return product;
        } catch (error) {
            console.error(error);
        };
    };
    deleteProduct = async (pid) => {
        try {
            const product = await this.model.deleteOne({ _id: pid });
            return product; 
        } catch (error) {
            console.error(error);
        };
    };
};