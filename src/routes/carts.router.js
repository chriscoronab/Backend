import { Router } from "express";
import { getCarts, postCart, cartRender, putCart, deleteProductsCart, postProductCart, putProductCart, deleteProductCart, purchase } from "../controllers/carts.controller.js";
import { authentication, authorization } from "../utils.js";

const router = Router();

router.get("/", authorization("Admin"), getCarts);

router.post("/", postCart);

router.get("/:cid", authentication, cartRender);

router.put("/:cid", authorization("User", "Premium"), putCart);

router.delete("/:cid", authorization("User", "Premium"), deleteProductsCart);

router.post("/:cid/products/:pid", authorization("User", "Premium"), postProductCart);

router.put("/:cid/products/:pid", authorization("User", "Premium"), putProductCart);

router.delete("/:cid/products/:pid", authorization("User", "Premium"), deleteProductCart);

router.get("/:cid/purchase", authorization("User", "Premium"), purchase);

export default router;