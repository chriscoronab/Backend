export default class UserRepository {
    constructor(dao) {
        this.dao = dao;
    };
    createUser = async user => { return await this.dao.createUser(user) };
    getUserByEmail = async email => { return this.dao.getUserByEmail(email) };
    getUserByUsername = async ({ email: username }) => { return this.dao.getUserByUsername({ email: username }) };
    getUserByID = async uid => { return this.dao.getUserByID(uid) };
    updateUser = async (uid, update) => { return this.dao.updateUser(uid, update) };
    updatePassword = async (user, newPassword) => { return this.dao.updatePassword(user, newPassword) };
};