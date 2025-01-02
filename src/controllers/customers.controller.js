import {asyncHandler} from "../utils/asynchandler.js";
import {ApiError} from "../utils/ApiError.js";
import {Customer} from "../models/Customers.model.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {getCurrentUserId} from "../utils/Utility.js";


// create customers
const createCustomer = asyncHandler(async (req, res) => {
    const {name, phone, email, storeId} = req.body;
    if ([name, phone, storeId].some((ele) => {
        if ((typeof ele === 'string' || ele instanceof String))
            return ele.trim() === ""
        else
            return !ele
    })) throw new ApiError(400, "Missing required fields");

    const customer = await Customer.create({
        name,
        phone,
        storeId,
        email: email || "",
        createdBy: getCurrentUserId(req),
        modifyBy: getCurrentUserId(req)
    });
    if (!customer) throw new ApiError(500, "Error occurred while creating customer");

    return res.status(201).json(new ApiResponse(200, customer, "Customer created successfully!"))
});

//update customers
const updateCustomer = asyncHandler(async (req, res) => {
    const {name, phone, email, storeId} = req.body;
    const customerId = req.query?.id;
    if (!customerId) throw new ApiError(400, "Invalid customer Id");
    if ([name, phone, storeId].some((ele) => {
        if ((typeof ele === 'string' || ele instanceof String))
            return ele.trim() === ""
        else
            return !ele
    })) throw new ApiError(400, "Missing required fields");

    const customer = await Customer.findOneAndUpdate({_id: customerId}, {
        $set: {
            name,
            phone,
            storeId,
            email: email || "",
            modifyBy: getCurrentUserId(req)
        }
    }, {new: true});

    if (!customer) throw new ApiError(400, "Something went wrong while updating the customer details");

    return res.status(200).json(new ApiResponse(200, customer, "Customer updated successfully!"))
})

// delete customers
const deleteCustomer = asyncHandler(async (req, res) => {
    const customerId = req.query?.id;
    if (!customerId) throw new ApiError(200, "Invalid customerId");

    const deletedCustomer = await Customer.findByIdAndDelete(customerId);
    if (!deletedCustomer) throw new ApiError(400, "Customer does not exist");
    return res.status(200).json(new ApiResponse(200, deletedCustomer, "Customer deleted successfully!"));
});

// get customers list by store id
const getCustomersListByStoreId = asyncHandler(async (req, res) => {
    const storeId = req.query?.storeId;

    if (!storeId) throw new ApiError(400, "Invalid storeId");

    const list = await Customer.find({storeId: storeId}, {createdAt: 0, __v: 0});
    if (!list || !list.length) throw new ApiError(400, "Customers is not added for given store");

    return res.status(200).json(new ApiResponse(200, list, "Fetched customers list successfully!"))
});

// get customer details
const getCustomerDetailsById = asyncHandler(async (req, res) => {
    const customerId = req.query?.id;
    if (!customerId) throw new ApiError(400, "Invalid customerId");

    const customer = await Customer.findById(customerId, "-createdAt -__v");
    if (!customer) throw new ApiError(400, "Customer does not exist for given Id");
    return res.status(200).json(new ApiResponse(200, customer, "Fetched customer details successfully!"));
})
// get customer purchase history

// get customer payment history

export {createCustomer, updateCustomer, deleteCustomer, getCustomersListByStoreId, getCustomerDetailsById}