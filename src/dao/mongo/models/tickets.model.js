import mongoose from "mongoose";

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    purchase_datetime: {
        type: Date,
        default: Date.now(),
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    },
    products: {
        type: [
            {
                _id: false,
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity: {
                    type: Number
                }
            }
        ],
        default: []
    },
    rejected_products: {
        type: [
            {
                _id: false,
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity: {
                    type: Number
                }
            }
        ],
        default: []
    }
});

ticketSchema.pre("findOne", function() {
    this.populate("products.product");
});

ticketSchema.pre("findOne", function() {
    this.populate("rejected_products.product");
});

const ticketModel = mongoose.model(ticketCollection, ticketSchema);

export default ticketModel;