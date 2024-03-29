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
        ref: "carts"
    },
    role: {
        type: String,
        required: true,
        enum: ["User", "Premium", "Admin"],
        default: "User"
    },
    avatar: String,
    last_connection: Date
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;