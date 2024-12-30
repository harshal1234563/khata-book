import {asyncHandler} from "../utils/asynchandler.js";
import {ApiError} from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import {User} from "../models/Users.models.js";
import {checkProtectedRoute} from "../utils/routes.util.js";

const verifyJWT = asyncHandler(async (req, _, next) => {

    if (checkProtectedRoute(req.path)) {
        const requestedToken = req.cookie?.accessToken || req.headers["authorization"]?.replace("Bearer ", "");
        if (!requestedToken) {
            throw new ApiError(401, "Unauthorized request")
        }

        const decodedToken = jwt.verify(requestedToken, process.env.ACCESS_TOKEN_SECRET);

        const user = User.findById(decodedToken?._id, "-password -refreshToken");
        if (!user) throw new ApiError(401, "Invalid access token");

        req.user = user;
    }
    next();
});

export {verifyJWT};