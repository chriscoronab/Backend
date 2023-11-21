import mongoose from "mongoose";

const productCollection = "products";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        index: true
    },
    description: String,
    category: String,
    price: Number,
    thumbnail: String,
    stock: Number
});

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;