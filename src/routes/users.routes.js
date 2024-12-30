import {Router} from "express";
import {loginUser, logOutUser, refreshAccessToken, registerUser} from "../controllers/users.controller.js";
import {upload} from "../middlewares/multer.middlewares.js";

const router = Router();

router.route("/register").post(upload.single('avatar'), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logOutUser)
router.route("/refresh-token").post(refreshAccessToken)
export default router;