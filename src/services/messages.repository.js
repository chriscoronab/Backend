export default class MessageRepository {
    constructor(dao) {
        this.dao = dao;
    };
    getMessages = async () => { return this.dao.getMessages() };
    createMessage = async message => { return this.dao.createMessage(message) };
    renderMessages = async () => { return this.dao.renderMessages() };
};