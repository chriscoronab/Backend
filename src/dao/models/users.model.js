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
        required: true
    },
    age: Number,
    password: String,
    role: {
        type: String,
        default: "User"
    }
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;