import {asyncHandler} from "../utils/asynchandler.js";

const registerUser = asyncHandler((req, res) => {
    res.status(500).json("Hi Harshal");
})

export {registerUser};