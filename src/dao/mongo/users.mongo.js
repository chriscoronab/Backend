import userModel from "./models/users.model.js";

export default class UserManager {
    constructor() {
        this.model = userModel;
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
    getUserByID = async id => {
        try {
            return await this.model.findById(id);
        } catch (error) {
            console.error(error);
        };
    };
};