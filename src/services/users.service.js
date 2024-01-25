export default class UserService {
    constructor(dao) {
        this.dao = dao;
    };
    createUser = async user => { return await this.dao.createUser(user) };
    getUserByEmail = async email => { return this.dao.getUserByEmail(email)};
    getUserByUsername = async ({ email: username }) => { return this.dao.getUserByUsername({ email: username }) };
    getUserByID = async id => { return this.dao.getUserByID(id) };
};