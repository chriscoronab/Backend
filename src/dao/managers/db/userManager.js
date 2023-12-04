import userModel from "../../models/users.model.js";

export default class UserManager {
    constructor() {
        this.model = userModel;
    };
    createUser = async (user) => {
        try {
            const newUser = await this.model.create(user);
            return newUser;
        } catch (error) {
            console.error(error);
        };
    };
    getUser = async (email) => {
        try {
            const user = await this.model.findOne({ email });
            return user;
        } catch (error) {
            console.error(error);
        };
    };
};