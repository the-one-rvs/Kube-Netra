import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { emailValidator, passValidator } from "../utils/validator.js";
import bcrypt from "bcrypt"


const createRootAdmin = asyncHandler(async(req, res) => {
    try {
        const { username, email, fullname, password } = req.body
        if (!username || !email || !fullname || !password) {
            throw new ApiError(400, "All fields are required")
        }

        if (!emailValidator(email)) {
            throw new ApiError(400, "Invalid email")
        }

        if (!passValidator(password)) {
            throw new ApiError(400, "Invalid password")
        }

        const exsistingAdmin = await User.findOne({ email })
        if (exsistingAdmin) {
            throw new ApiError(400, "User already exists")
        }
        const user = await User.create(
            {
                username: username, 
                email: email, 
                fullname: fullname, 
                password: password,
                permissions: ["admin"] 
            }
        )
        const createdAdmin = await User.findById(user._id).select("-password -refreshToken")
        if (!createdAdmin) {
            throw new ApiError(400, "User not found")
        }

        return res.status(200).json(new ApiResponse(
            200,
            createdAdmin,
            "Admin registered successfully"
        ))
    } catch (error) {
        
    }
})

const registerUser = asyncHandler(async(req, res) => {
    try {
        const { username, email, fullname, password, permissions } = req.body
        if (!username || !email || !fullname || !password) {
            throw new ApiError(400, "All fields are required")
        }

        if (!permissions) {
            throw new ApiError(400, "Permissions are required")
        }

        if (!Array.isArray(permissions)) {
            throw new ApiError(400, "Permissions must be an array")
        }

        if (!emailValidator(email)) {
            throw new ApiError(400, "Invalid email")
        }

        if (!passValidator(password)) {
            throw new ApiError(400, "Invalid password")
        }

        const exsistingUser = await User.findOne({ email })
        if (exsistingUser) {
            throw new ApiError(400, "User already exists")
        }
        const user = await User.create(
            {
                username: username, 
                email: email, 
                fullname: fullname, 
                password: password,
                permissions: permissions 
            }
        )
        const createdUser = await User.findById(user._id).select("-password -refreshToken")
        if (!createdUser) {
            throw new ApiError(400, "User not found")
        }

        return res.status(200).json(new ApiResponse(
            200,
            createdUser,
            "User registered successfully"
        ))
    } catch (error) {
        throw new ApiError(400, error?.message)
    }
})


const loginUser = asyncHandler(async(req, res) => {
    try {
        const {email, username, password} = req.body;

        if (!(email || username)) {
            throw new ApiError(400, "Email or username is required")
        }
        if (!password){
            throw new ApiError(400, "Password is required")
        }
        const user = await User.findOne({
            $or: [
                {email: email},
                {username: username}
            ]
        })

        if (!user){
            throw new ApiError(400, "User not found")
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect){
            throw new ApiError(400, "Invalid credentials")
        }

        const accessToken = jwt.sign({
            _id: user._id,
            email: user.email,
            username: user.username,
            fullname: user.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
        )

        const refreshToken = jwt.sign({
            _id: user._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
        )

        user.refreshToken = refreshToken
        await user.save()

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

        const options = {
            secure: true,
            httpOnly: true
        }

        res.cookie("accessToken", accessToken, options)
        res.cookie("refreshToken", refreshToken, options)
        return res.status(200).json(new ApiResponse(
            200,
            {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            "User logged in successfully"
        ))


    } catch (error) {
        throw new ApiError(400, error?.message)
    }
})

const logoutUser = asyncHandler(async(req, res) => {
    try {
        const user = req.user
        user.refreshToken = undefined;
        await user.save({ validateBeforeSave: false });

        const options = {
            httpOnly: true,
            secure: true
        };
        

        return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
    } catch (error) {
        throw new ApiError(400, error?.message)
    }
})

const reclaimTokens = asyncHandler(async(req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken

        if (!refreshToken) {
            throw new ApiError(400, "Refresh token is required")
        }

        const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password")

        if (!user) {
            throw new ApiError(400, "User not found")
        }

        if (user.refreshToken !== refreshToken) {
            throw new ApiError(400, "Invalid refresh token")
        }

        const newAccessToken = jwt.sign({
            _id: user._id,
            email: user.email,
            username: user.username,
            fullname: user.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
        )

        const newRefreshToken = jwt.sign({
            _id: user._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
        )

        user.refreshToken = newRefreshToken
        await user.save()

        const options = {
            secure: true,
            httpOnly: true
        }

        res.cookie("accessToken", newAccessToken, options)
        res.cookie("refreshToken", newRefreshToken, options)
        return res.status(200).json(new ApiResponse(
            200,
            {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            },
            "Tokens reclaimed successfully"
        ))

    } catch (error) {
        throw new ApiError(400, error?.message)
    }
})

const getMe = asyncHandler(async(req, res) => {
    try {
        const user = req.user
        if (!user) {
            throw new ApiError(400, "User not found")
        }
        return res.status(200).json(new ApiResponse(200, user, "User found successfully"))
    } catch (error) {
        throw new ApiError(400, error?.message)
    }
})

const deleteUser = asyncHandler(async(req, res) => {
    try {
        const user = req.user
        if (!user) {
            throw new ApiError(400, "User not found")
        }
        await User.findByIdAndDelete(user._id)

        const options = {
            secure: true,
            httpOnly: true
        }

        return res
        .status(200)
        .clearCookie("accessToken",  options)
        .clearCookie("refreshToken",  options)
        .json(new ApiResponse(200, {}, "User deleted successfully"))
    } catch (error) {
        throw new ApiError(400, error?.message)
    }
})

const updateUser = asyncHandler(async(req, res) => {
    try {
        const {fullname, username, email} = req.body
        

        if (!fullname || !email || !username) {
            throw new ApiError(404, "All fields are required")
        }

        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set:{ 
                    fullname: fullname,
                    email: email,
                    username: username
                }
            },
            {new: true}
        ).select("-password")
        
        
        return res
        .status(200)
        .json ( new ApiResponse(200, user, "Account Details Updated"))
    } catch (error) {
        throw new ApiError(400, error?.message)
    }
})


const changePassword = asyncHandler(async(req, res) => {
    try {
        const {oldPassword, newPassword} = req.body

        const user = await User.findById(req.user?._id)
        const isPassCorrect = await user.isPasswordCorrect(oldPassword)

        if (!isPassCorrect){
            throw new ApiError(400, "Invalid Password")
        }

        user.password = newPassword
        user.save({validateBeforeSave: false})

        return res.status(200)
        .json(new ApiResponse(200,{},"Password Changed"))
        
    } catch (error) {
        
    }
})

const getAllUser = asyncHandler(async(req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(400, "Unauthorized request")
        }
        const users = await User.find().select("-password -refreshToken")
        if (!users){
            throw new ApiError(400, "Users not found")
        }

        return res.status(200).json(new ApiResponse(200, users, "Users found successfully"))

    } catch (error) {
        throw new ApiError(400, error?.message)
    }
})


export {
    createRootAdmin, 
    registerUser,
    loginUser,
    logoutUser,
    reclaimTokens,
    deleteUser,
    getMe,
    updateUser,
    changePassword,
    getAllUser
}