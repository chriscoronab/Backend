import ticketModel from "./models/tickets.model.js";

export default class TicketManager {
    constructor() {
        this.model = ticketModel;
    };
    createTicket = async ticket => {
        try {
            return await this.model.create(ticket);
        } catch {
            console.error(error);
        };
    };
    getTicketByID = async id => {
        try {
            return await this.model.findById(id).lean().exec();
        } catch {
            console.error(error);
        };
    };
};