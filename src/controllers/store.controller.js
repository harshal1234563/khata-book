import {asyncHandler} from "../utils/asynchandler.js";
import {ApiError} from "../utils/ApiError.js";
import {Store} from "../models/Store.model.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {getCurrentUserId} from "../utils/Utility.js";

// Create new store
const createStore = asyncHandler(async (req, res) => {
    const {name, address} = req.body;
    if (!(name && address)) throw new ApiError(400, "All fields are required!");

    const store = await Store.findOne({name, owner: req.user?._id});
    if (store) throw new ApiError(400, "Store is already exist for user");


    const createdStore = await Store.create({
        name, address, owner: req.user?._id
    });

    if (!createdStore) throw new ApiError(500, "Error occurred while creating the store");

    return res.status(201).json(new ApiResponse(200, createdStore, "New Store created successfully!"))
});

// update store
const updateStore = asyncHandler(async (req, res) => {
    const {id, name, address} = req.body;
    if (!(id && name && address)) throw new ApiError(400, "All fields are required!");

    const store = await Store.findOneAndUpdate({_id: id, isDeleted: false}, {$set: {name, address}}, {new: true});
    if (!store) throw new ApiError(400, "Store does not exist");

    return res.status(200).json(new ApiResponse(200, store, "Store updated successfully!"));
})

// delete store
const deleteStore = asyncHandler(async (req, res) => {
    const id = req.query?.id;
    if (!id) throw new ApiError(400, "Invalid store Id");

    const deletedStore = await Store.findByIdAndUpdate(id, {$set: {isDeleted: true}}, {new: true});
    if (!deletedStore) throw new ApiError(400, "Store does not exist");

    return res.status(200).json(new ApiResponse(200, id, "Store deleted successfully!"));

})

// get store by Id
const getStoreById = asyncHandler(async (req, res) => {
    const id = req.params?.id || '';
    if (!id) throw new ApiError(400, "Invalid store Id");

    const store = await Store.findOne({
        _id: id,
        isDeleted: false,
        owner: getCurrentUserId(req)
    }, "-createdAt -updatedAt -__v");
    if (!store) throw new ApiError(400, "Store does not exist");

    return res.status(200).json(new ApiResponse(200, store));
})

// get store list
const getStoresList = asyncHandler(async (req, res) => {

    const store = await Store.find({owner: getCurrentUserId(req), isDeleted: false}, { createdAt: 0, updatedAt: 0, __v: 0 });
    if (!store) throw new ApiError(400, "Store does not exist");

    return res.status(200).json(new ApiResponse(200, store));
})


export {createStore, updateStore, deleteStore, getStoreById, getStoresList};