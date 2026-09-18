import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {upload} from "../middleware/multer.middleware.js"
import { addProduct, deleteProduct, getProductsBySeller } from "../controllers/product.controller.js";

const router = Router();

// router.use(verifyJWT);

router.route("/products/add").post(
    upload.array("productImages", 5),
    addProduct
)

router.route("/products").get(getProductsBySeller);
router.route('/products/:productId').delete(deleteProduct);

export default router;