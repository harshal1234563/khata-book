import {asyncHandler} from "../utils/asynchandler.js";
import {checkMissingFields, getCurrentUserId} from "../utils/Utility.js";
import {ApiError} from "../utils/ApiError.js";
import {Purchase} from "../models/Purchase.model.js";
import {PAID_ENUM} from "../constants.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const getPaidStatus = (totalAmount, amount) => {
    if (amount === 0) return PAID_ENUM[0];
    if (amount === totalAmount) return PAID_ENUM[1];
    return PAID_ENUM[2];
}
// add purchase data
const addPurchaseData = asyncHandler(async (req, res) => {
    const {purchaseDetails, totalAmount, amount, purchaseDate, customerId} = req.body;

    if (checkMissingFields([purchaseDetails, totalAmount, amount, purchaseDate])) throw new ApiError(400, "All fields are required");
    const purchase = await Purchase.create({
        purchaseDetails,
        totalAmount,
        amount,
        customerId,
        purchaseDate: new Date(purchaseDate),
        paid: getPaidStatus(totalAmount, amount),
        modifiedBy: getCurrentUserId(req),
        createdBy: getCurrentUserId(req),
    });

    if (!purchase) throw new ApiError(500, "Error occurred while creating the Purchase data");

    return res.status(201).json(new ApiResponse(200, purchase, "Data added successfully!"));
})

// edit purchase data
const editPurchaseData = asyncHandler(async (req, res) => {
    const {purchaseDetails, purchaseDate} = req.body;
    const {purchaseId, customerId} = req.query;
    if (checkMissingFields([purchaseDetails, purchaseDate, customerId, purchaseId])) throw new ApiError(400, "required fields are missing");

    const purchaseData = await Purchase.findByIdAndUpdate(purchaseId, {
        $set: {
            purchaseDetails,
            purchaseDate,
            customerId
        }
    }, {new: true});
    if (!purchaseData) throw new ApiError(500, "Something went wrong while updating the data");

    return res.status(200).json(new ApiResponse(200, purchaseData, "Data updated successfully!"));
});

// get purchase details by Id
const getPurchaseDetailById = asyncHandler(async (req, res) => {
    const purchaseId = req.params?.id;
    if (!purchaseId) throw new ApiError(400, "Invalid purchaseId");

    const data = await Purchase.findById(purchaseId, "-__v -createdBy -createdAt");
    if (!data) throw new ApiError(400, "Purchase Data is not available fo given Id");

    return res.status(200).json(new ApiResponse(200, data, "Fetched date successfully!"));
})

export {addPurchaseData, editPurchaseData, getPurchaseDetailById};