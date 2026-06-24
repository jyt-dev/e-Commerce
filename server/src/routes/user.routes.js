import {Router} from "express";
import { updatePassword, updateAccountDetails, getCurrentUser, becomeSeller } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/me")
    .get(getCurrentUser)
    .patch(updateAccountDetails);

router.route("/me/password").patch(updatePassword)
router.route("/me/role").patch(becomeSeller);

export default router;