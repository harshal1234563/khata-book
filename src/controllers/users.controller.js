import {asyncHandler} from "../utils/asynchandler.js";
import {User} from "../models/Users.models.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {uploadFile} from "../services/cloudinary.service.js";

const registerUser = asyncHandler(async (req, res) => {
    const {userName, fullName, email, password, role} = req.body;

    // check all required field is present
    if ([userName, fullName, email, password, role].some((ele) => ele?.trim() === ""))
        throw new ApiError(400, "All fields are required!");

    // check user already present
    const userExisted = await User.findOne({$or: [{userName}, {email}]});
    if (userExisted) throw new ApiError(409, "User existed");

    // get and upload avatar image
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) throw new ApiError(400, "Avatar is required!");

    const avatar = await uploadFile(avatarLocalPath);

    if (!avatar) throw new ApiError(400, "Avatar is required");

    const user = await User.create({
        userName: userName.toLowerCase(),
        fullName: fullName,
        email: email,
        avatar: avatar.url,
        password: password,
        role: role
    })
    const createdUser = await User.findById(user._id, "-password -refreshToken");
    if (!createdUser)
        throw new ApiError(500, "Something went wrong while registering user");

    res.status(201).json(new ApiResponse(200, createdUser, "User register successfully"));
})

export {registerUser};