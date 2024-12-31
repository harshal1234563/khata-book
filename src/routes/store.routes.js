import {Router} from "express";
import {createStore, deleteStore, getStoreById, getStoresList, updateStore} from "../controllers/store.controller.js";

const router = Router();

router.route("/create").post(createStore);
router.route("/update").patch(updateStore);
router.route("/delete").delete(deleteStore);
router.route("/list").get(getStoresList);
router.route("/:id").get(getStoreById);

export default router;