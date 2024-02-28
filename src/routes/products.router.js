import { Router } from "express";
import { productsRender, createRender, postProduct, productRender, putProduct, deleteProduct } from "../controllers/products.controller.js";
import { authentication, authorization } from "../utils.js";

const router = Router();

router.get("/", authentication, productsRender);

router.get("/create", authorization("Admin", "Premium"), createRender);

router.post("/create", authorization("Admin", "Premium"), postProduct);

router.get("/:pid", authentication, productRender);

router.put("/:pid", authorization("Admin", "Premium"), putProduct);

router.delete("/:pid", authorization("Admin", "Premium"), deleteProduct);

export default router;