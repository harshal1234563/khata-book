import {asyncHandler} from "../utils/asynchandler.js";
import {User} from "../models/Users.models.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {uploadFile} from "../services/cloudinary.service.js";

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

    const opt = {
        httpOnly: true,
        secure: true
    }
    return res.status(200).cookie("accessToken", accessToken, opt).cookie("refreshToken", refreshToken, opt).json(new ApiResponse(200, {
        loggedInUser,
        accessToken,
        refreshToken
    }));
});

const logOutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user?._id, {$set: {refreshToken: undefined}}, {new: true});
    const opt = {
        httpOnly: true,
        secure: true
    }
    return res.status(200).clearCookie("accessToken", opt).clearCookie("refreshToken", opt).json(new ApiResponse(200, {}, "User logged out success fully!"))
})
export {registerUser, loginUser, logOutUser};