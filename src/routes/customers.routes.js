import {Router} from "express";
import {
    createCustomer,
    deleteCustomer, getCustomerDetailsById,
    getCustomersListByStoreId, getPurchaseHistory,
    updateCustomer
} from "../controllers/customers.controller.js";

const router = Router();
router.route("/create").post(createCustomer);
router.route("/update").patch(updateCustomer);
router.route("/delete").delete(deleteCustomer);
router.route("/list").get(getCustomersListByStoreId);
router.route("/detail").get(getCustomerDetailsById);
router.route("/history/:id").get(getPurchaseHistory);


export default router;