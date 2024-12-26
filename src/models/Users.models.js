import mongoose, {Schema} from "mongoose";
import bycrypt from "bycrypt";
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
            unique: true
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
    this.password = bycrypt.hash(this.password, 10);
});

// add custom method in schema
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bycrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            id: this._id,
            userName: this.userName,
            email: this.email,
            fullName: this.fullName,
            avatar: this.avatar
        }, process.env.ACCESS_TOKEN_SECRET,
        {exp: process.env.ACCESS_TOKEN_EXPIRY})
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {exp: process.env.REFRESH_TOKEN_EXPIRY})
}
export const User = mongoose.model("User", userSchema);
