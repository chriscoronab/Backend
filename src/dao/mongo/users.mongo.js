import userModel from "./models/users.model.js";

export default class UserManager {
    constructor() {
        this.model = userModel;
    };
    getUsers = async () => {
        try {
            return await this.model.find();
        } catch (error) {
            console.error(error);
        };
    };
    createUser = async user => {
        try {
            return await this.model.create(user);
        } catch (error) {
            console.error(error);
        };
    };
    getUserByEmail = async email => {
        try {
            return await this.model.findOne({ email });
        } catch (error) {
            console.error(error);
        };
    };
    getUserByUsername = async ({ email: username }) => {
        try {
            return await this.model.findOne({ email: username });
        } catch (error) {
            console.error(error);
        };
    };
    getUserByID = async uid => {
        try {
            return await this.model.findById(uid);
        } catch (error) {
            console.error(error);
        };
    };
    updateUser = async (uid, update) => {
        try {
            return await this.model.updateOne({ _id: uid }, update);
        } catch (error) {
            console.error(error);
        };
    };
    updatePassword = async (user, newPassword) => {
        try {
            return await this.model.updateOne({ _id: user._id }, { password: newPassword });
        } catch (error) {
            console.error(error);
        };
    };
    deleteUser = async uid => {
        try {
            return await this.model.deleteOne({ _id: uid });
        } catch (error) {
            console.error(error);
        };
    };
};