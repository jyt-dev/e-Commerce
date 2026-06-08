import {Router} from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser, updatePassword, updateAccountDetails, getCurrentUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/update-account-details").patch(verifyJWT, updateAccountDetails);

router.route("/update-password").patch(verifyJWT, updatePassword);

router.route("/refresh-accessToken").post(refreshAccessToken);

router.route("/current-user").get(verifyJWT,getCurrentUser);

export default router;