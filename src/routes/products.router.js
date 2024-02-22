import { Router } from "express";
import { productsRender, createRender, productRender, postProduct, putProduct, deleteProduct } from "../controllers/products.controller.js";
import { authentication, authorization } from "../utils.js";

const router = Router();

router.get("/", authentication, productsRender);

router.get("/create", authorization("Admin", "Premium"), createRender);

router.get("/:pid", authentication, productRender);

router.post("/create", authorization("Admin", "Premium"), postProduct);

router.put("/:pid", authorization("Admin", "Premium"), putProduct);

router.delete("/:pid", authorization("Admin", "Premium"), deleteProduct);

export default router;