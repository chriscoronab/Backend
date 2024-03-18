export default class CartRepository {
    constructor(dao) {
        this.dao = dao;
    };
    getCarts = async () => { return this.dao.getCarts() };
    createCart = async cart => { return this.dao.createCart(cart) };
    getCartByID = async cid => { return this.dao.getCartByID(cid) };
    updateCart = async (cid, update) => { return this.dao.updateCart(cid, update) };
    deleteAllCartProducts = async cid => { return this.dao.deleteAllCartProducts(cid) };
    addProductToCart = async (cid, pid) => { return this.dao.addProductToCart(cid, pid) };
    deleteCartProduct = async (cid, pid) => { return this.dao.deleteCartProduct(cid, pid) };
};