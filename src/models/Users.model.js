import mongoose, {Schema} from "mongoose";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken"

const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: [true, "User name is required"],
            unique: true,
            trim: true,
            lowercase: true,
            index: true
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        },
        avatar: {
            type: String, // cloudnary URL
            required: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        refreshToken: {
            type: String
        },
        role: {
            type: String,
            required: true,
            lowercase: true
        }
    },
    {timestamps: true}
);

// call hook for schema
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bycrypt.hash(this.password, 10);
});

// add custom method in schema
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bycrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            userName: this.userName,
            email: this.email,
            fullName: this.fullName,
            avatar: this.avatar
        }, process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: `${process.env.ACCESS_TOKEN_EXPIRY}`});
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRY})
}
export const User = mongoose.model("User", userSchema);
