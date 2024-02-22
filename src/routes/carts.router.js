import { Router } from "express";
import { getCarts, postCart, cartRender, postProductCart, putCart, putProductCart, deleteProductCart, deleteProductsCart, purchase } from "../controllers/carts.controller.js";
import { authentication, authorization } from "../utils.js";

const router = Router();

router.get("/", authorization("Admin"), getCarts);

router.post("/", postCart);

router.get("/:cid", authentication, cartRender);

router.post("/:cid/products/:pid", authorization("User", "Premium"), postProductCart);

router.put("/:cid", authorization("User", "Premium"), putCart);

router.put("/:cid/products/:pid", authorization("User", "Premium"), putProductCart);

router.delete("/:cid/products/:pid", authorization("User", "Premium"), deleteProductCart);

router.delete("/:cid", authorization("User", "Premium"), deleteProductsCart);

router.get("/:cid/purchase", authorization("User", "Premium"), purchase);

export default router;