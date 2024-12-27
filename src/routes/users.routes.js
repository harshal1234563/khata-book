import {Router} from "express";
import {registerUser} from "../controllers/users.controller.js";
import {upload} from "../middlewares/multer.middlewares.js";

const router = Router();

router.route("/register").post(upload.single('avatar'),registerUser);

export default router;