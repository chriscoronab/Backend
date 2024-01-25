import { Router } from "express";
import { getCarts, postCart, cartRender, postProductCart, putCart, putProductCart, deleteProductCart, deleteProductsCart, purchase } from "../controllers/carts.controller.js";
import { authentication, authorization } from "../utils.js";

const router = Router();

router.get("/", authorization("Admin"), getCarts);

router.post("/", postCart);

router.get("/:cid", authentication, cartRender);

router.post("/:cid/products/:pid", authorization("User"), postProductCart);

router.put("/:cid", authorization("User"), putCart);

router.put("/:cid/products/:pid", authorization("User"), putProductCart);

router.delete("/:cid/products/:pid", authorization("User"), deleteProductCart);

router.delete("/:cid", authorization("User"), deleteProductsCart);

router.get("/:cid/purchase", authorization("User"), purchase);

export default router;