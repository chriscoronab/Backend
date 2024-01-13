import { Router } from "express";
import { productsRender, createRender, productRender, postProduct, putProduct, deleteProduct } from "../controllers/products.controller.js";
import { authentication, authorization } from "../utils.js";

const router = Router();

router.get("/", authentication, productsRender);

router.get("/create", authorization("Admin"), createRender);

router.get("/:pid", authentication, productRender);

router.post("/create", postProduct);

router.put("/:pid", putProduct);

router.delete("/:pid", deleteProduct);

export default router;