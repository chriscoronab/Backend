import productModel from "./models/products.model.js";

export default class ProductManager {
    constructor() {
        this.model = productModel;
    };
    getProducts = async () => {
        try {
            return await this.model.find();
        } catch (error) {
            console.error(error);
        };
    };
    addProduct = async product => {
        try {
            return await this.model.create(product);
        } catch (error) {
            console.error(error);
        };
    };
    getProductByID = async pid => {
        try {
            return await this.model.findOne({ _id: pid }).lean().exec();
        } catch (error) {
            console.error(error);
        };
    };
    updateProduct = async (pid, update) => {
        try {
            return await this.model.updateOne({ _id: pid }, update);
        } catch (error) {
            console.error(error);
        };
    };
    deleteProduct = async pid => {
        try {
            return await this.model.deleteOne({ _id: pid });
        } catch (error) {
            console.error(error);
        };
    };
    paginate = async (filter, options) => {
        try {
            return await this.model.paginate(filter, options);
        } catch (error) {
            console.error(error);
        };
    };
};