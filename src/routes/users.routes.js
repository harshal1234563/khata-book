import {Router} from "express";
import {
    changePassword,
    loginUser,
    logOutUser,
    refreshAccessToken,
    registerUser, updateAccountDetails, updateAvatar
} from "../controllers/users.controller.js";
import {upload} from "../middlewares/multer.middlewares.js";

const router = Router();

router.route("/register").post(upload.single('avatar'), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logOutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(changePassword);
router.route("/update").patch(updateAccountDetails);
router.route("/update-avatar").patch(upload.single("avatarFile"), updateAvatar)

export default router;