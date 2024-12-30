import {asyncHandler} from "../utils/asynchandler.js";
import {User} from "../models/Users.models.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {deleteFile, getPublicId, uploadFile} from "../services/cloudinary.service.js";
import jwt from "jsonwebtoken";

const opt = {
    httpOnly: true, secure: true
}

const generateAccessAndRefreshToken = async (user) => {
    try {
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    } catch (e) {
        throw new ApiError(500, "Something went wrong while generating token");
    }
}

// register user
const registerUser = asyncHandler(async (req, res) => {
    const {userName, fullName, email, password, role} = req.body;

    // check all required field is present
    if ([userName, fullName, email, password, role].some((ele) => ele?.trim() === "")) throw new ApiError(400, "All fields are required!");

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
    if (!createdUser) throw new ApiError(500, "Something went wrong while registering user");

    return res.status(201).json(new ApiResponse(200, createdUser, "User register successfully"));
})

// login user
const loginUser = asyncHandler(async (req, res) => {

    const {userName, password} = req.body;
    if (!userName && !password) throw new ApiError(400, "Invalid username or password, please check!");

    // check user is present
    const user = await User.findOne({$or: [{userName: userName}, {email: userName}]});
    // if user is not found throw error
    if (!user) throw new ApiError(404, "User does not exist");
    const isCorrectPassword = await user.isPasswordCorrect(password); // check password is same, via bcrypt

    // if password incorrect throw error
    if (!isCorrectPassword) throw new ApiError(401, "Invalid user credential");

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user);
    const loggedInUser = await User.findById(user._id, '-password -refreshToken');

    return res.status(200).cookie("accessToken", accessToken, opt).cookie("refreshToken", refreshToken, opt).json(new ApiResponse(200, {
        loggedInUser, accessToken, refreshToken
    }));
});

const logOutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user?._id, {$set: {refreshToken: undefined}}, {new: true});

    return res.status(200).clearCookie("accessToken", opt).clearCookie("refreshToken", opt).json(new ApiResponse(200, {}, "User logged out success fully!"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRequestedToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRequestedToken) throw new ApiError(401, "Un-Authorize request");

    const decodedToken = jwt.verify(incomingRequestedToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id);
    if (!user) throw new ApiError(401, "Invalid refresh token")

    if (incomingRequestedToken !== user?.refreshToken) {
        throw new ApiError(401, "Refresh toke is expired or used");
    }

    const {accessToken, newRefreshToken} = generateAccessAndRefreshToken(user);
    return res.status(200).cookie("accessToken", accessToken, opt).cookie("refreshToken", newRefreshToken, opt).json(200, {
        accessToken, refreshToken: newRefreshToken
    }, "Access token refreshed successfully!")
})

// create method to change the password
const changePassword = asyncHandler(async (req, res) => {
    const {oldPassword, newPassword, confirmationPassword} = req.body;
    if (newPassword !== confirmationPassword) throw new ApiError(400, "Confirm password is wrong!");

    const user = await User.findOne({_id: req.user?._id});
    if (!user?.isPasswordCorrect(oldPassword)) throw new ApiError(400, "Password is Incorrect!");

    user.password = newPassword;
    user.save({validateBeforeSave: false});

    return res.status(200).json(new ApiResponse(200, {}, "Password updated successfully!"))
});

// create method to get the user details
const getCurrentUser = asyncHandler((req, res) => {
    if (!req?.user) throw new ApiError(500, "Error: Error occurred while getting the user data");
    return res.status(200).json(new ApiResponse(200, req?.user, "Fetched current user details successfully!"));
});

// create method to update the details
const updateAccountDetails = asyncHandler(async (req, res) => {
    const {role, email, fullName, userName} = req.body;

    if (!role || !email || !fullName || !userName) throw new ApiError(400, "All Fields are required!");

    const user = await User.findByIdAndUpdate(req.user?._id, {$set: {role, email, fullName, userName}}, {new: true});

    return res.status(200).json(new ApiResponse(200, user, "Details updated successfully!"));
});

// create method to update the avatar(add support to delete the previous file uploaded by user)
const updateAvatar = asyncHandler(async (req, res) => {
    // get and upload avatar image
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) throw new ApiError(400, "Avatar is required!");

    const avatar = await uploadFile(avatarLocalPath);
    // check avatar updated successfully
    if (!avatar) throw new ApiError(500, "Error occurred while uploading file");

    const existingFilePublicId = getPublicId(req.user?.avatar); // get publicId to delete the file

    const isAvatarDeleted = await deleteFile(existingFilePublicId);
    console.warn(isAvatarDeleted ? "Existing avatar file deleted successfully" : "")

    // update avatar field in DB.
    const user = await User.findByIdAndUpdate(req.user?._id, {$set: {avatar: avatar.url}}, {new: true});

    if (!user) throw new ApiError(500, "Error occurred while updating avatar link!");

    return res.status(200).json(new ApiResponse(200, user, "Avatar updated successfully!"));
})
export {
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    changePassword,
    getCurrentUser,
    updateAccountDetails,
    updateAvatar
};