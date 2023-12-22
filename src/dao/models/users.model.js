import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: String,
    email: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    age: Number,
    password: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts",
        default: "655bdcf9db12be4cc7e741d0"
    },
    role: {
        type: String,
        default: "User"
    }
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;