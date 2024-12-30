import {Router} from "express";
import {loginUser, logOutUser, registerUser} from "../controllers/users.controller.js";
import {upload} from "../middlewares/multer.middlewares.js";
import {verifyJWT} from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register").post(upload.single('avatar'), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logOutUser)
export default router;