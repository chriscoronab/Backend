import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        index: true,
        required: true
    },
    age: {
        type: Number,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "User"
    }
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;