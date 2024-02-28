export default class TicketRepository {
    constructor(dao) {
        this.dao = dao;
    };
    createTicket = async ticket => { return this.dao.createTicket(ticket) };
    getTicketByID = async id => { return this.dao.getTicketByID(id) };
};