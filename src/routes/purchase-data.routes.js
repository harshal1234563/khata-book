import {Router} from "express";
import {addPurchaseData, editPurchaseData, getPurchaseDetailById} from "../controllers/purchase.controller.js";

const router = Router();

router.route("/create").post(addPurchaseData);
router.route("/update").patch(editPurchaseData);
router.route("/:id").get(getPurchaseDetailById);

export default router;