export default class UserRepository {
    constructor(dao) {
        this.dao = dao;
    };
    getUsers = async () => { return await this.dao.getUsers() };
    createUser = async user => { return await this.dao.createUser(user) };
    getUserByEmail = async email => { return this.dao.getUserByEmail(email) };
    getUserByUsername = async ({ email: username }) => { return this.dao.getUserByUsername({ email: username }) };
    getUserByID = async uid => { return this.dao.getUserByID(uid) };
    updateUser = async (uid, update) => { return this.dao.updateUser(uid, update) };
    updatePassword = async (user, newPassword) => { return this.dao.updatePassword(user, newPassword) };
    deleteUser = async uid => { return await this.dao.deleteUser(uid) };
};