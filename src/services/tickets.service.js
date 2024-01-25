export default class TicketService {
    constructor(dao) {
        this.dao = dao;
    };
    getTickets = async () => { return this.dao.getTickets() };
    createTicket = async ticket => { return this.dao.createTicket(ticket) };
    getTicketByID = async id => { return this.dao.getTicketByID(id) };
};