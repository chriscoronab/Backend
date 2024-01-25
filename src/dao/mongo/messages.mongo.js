import messageModel from "./models/messages.model.js";

export default class TicketManager {
    constructor() {
        this.model = messageModel;
    };
    getMessages = async () => {
        try {
            return await this.model.find();
        } catch (error) {
            console.error(error);
        };
    };
    createMessage = async message => {
        try {
            return await this.model.create(message);
        } catch (error) {
            console.error(error);
        };
    };
    renderMessages = async () => {
        try {
            return await this.model.find().lean().exec();
        } catch (error) {
            console.error(error);
        };
    };
};