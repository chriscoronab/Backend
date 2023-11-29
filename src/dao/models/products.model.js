import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;