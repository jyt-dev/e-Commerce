import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getProductById, getProducts } from "../controllers/product.controller.js";

const router = Router();


router.route("/products").get(getProducts);
router.route("/:productId").get(getProductById)

export default router