import {Router} from "express";
import {
    createCustomer,
    deleteCustomer, getCustomerDetailsById,
    getCustomersListByStoreId,
    updateCustomer
} from "../controllers/customers.controller.js";

const router = Router();
router.route("/create").post(createCustomer);
router.route("/update").patch(updateCustomer);
router.route("/delete").delete(deleteCustomer);
router.route("/list").get(getCustomersListByStoreId);
router.route("/detail").get(getCustomerDetailsById);


export default router;