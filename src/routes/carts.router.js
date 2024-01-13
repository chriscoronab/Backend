import { Router } from "express";
import { getCarts, postCart, cartRender, postProductCart, putCart, putProductCart, deleteProductCart, deleteProductsCart } from "../controllers/carts.controller.js";
import { authentication } from "../utils.js";

const router = Router();

router.get("/", getCarts);

router.post("/", postCart);

router.get("/:cid", authentication, cartRender);

router.post("/:cid/products/:pid", postProductCart);

router.put("/:cid", putCart);

router.put("/:cid/products/:pid", putProductCart);

router.delete("/:cid/products/:pid", deleteProductCart);

router.delete("/:cid", deleteProductsCart);

export default router;