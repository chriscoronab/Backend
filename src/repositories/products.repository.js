export default class ProductRepository {
    constructor(dao) {
        this.dao = dao;
    };
    getProducts = async () => { return this.dao.getProducts() };
    addProduct = async product => { return this.dao.addProduct(product) };
    getProductByID = async pid => { return this.dao.getProductByID(pid) };
    updateProduct = async (pid, update) => { return this.dao.updateProduct(pid, update) };
    deleteProduct = async pid => { return this.dao.deleteProduct(pid) };
    paginate = async (filter, options) => { return this.dao.paginate(filter, options) };
};