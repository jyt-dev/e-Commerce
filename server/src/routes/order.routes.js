import { Router } from "express";
import {
  createOrder,
  getOrders,
  getOrder,
  cancelOrder,
} from "../controllers/order.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/", createOrder);

router.get("/", getOrders);

router.get("/:orderId", getOrder);

router.patch("/:orderId/cancel", cancelOrder);

export default router;