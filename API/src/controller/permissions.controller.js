import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { PERMISSION_LIST } from "../utils/permissions.js"

const showPermissions = asyncHandler(async(req, res) => {
    return res.status(200)
    .json(new ApiResponse(200, PERMISSION_LIST, "Permissions list found successfully"))
})

const addUserPermission = asyncHandler(async(req, res) => {
    const {newPermissions} = req.body
    const {userId} = req.params
    if (!newPermissions){
        throw new ApiError(400, "Permissions not found")
    }
    if (userId === req.user._id){
        throw new ApiError(400, "You cannot add permissions to yourself")
    }
    if (!Array.isArray(newPermissions)){
        throw new ApiError(400, "Permissions must be an array")
    }
    if (!userId){
        throw new ApiError(400, "User id not found")
    }
    const updatedUserPermissions = await User.findByIdAndUpdate(
        userId,
        { 
            $addToSet: { 
                permissions: {
                    $each: newPermissions 
                } 
            } 
        },
        { new: true }
    ).select("permissions -_id")

    if (!updatedUserPermissions) {
        throw new ApiError(400, "User not found")
    }

    return res.status(200)
    .json(new ApiResponse(200, updatedUserPermissions, "Permissions added successfully"))
})

const removePermissions = asyncHandler(async(req, res) => {
    const {permissionsToRemove} = req.body
    const {userId} = req.params
    if (!permissionsToRemove){
        throw new ApiError(400, "Permissions not found")
    }
    if (userId === req.user._id){
        throw new ApiError(400, "You cannot remove permissions from yourself")
    }
    if (!Array.isArray(permissionsToRemove)){
        throw new ApiError(400, "Permissions must be an array")
    }
    if (!userId){
        throw new ApiError(400, "User id not found")
    }
    const updatedUserPermissions = await User.findByIdAndUpdate(
        userId,
        { 
            $pull: { 
                permissions: {
                    $in: permissionsToRemove 
                } 
            } 
        },
        { new: true , runValidators: true }
    ).select("permissions -_id")

    if (!updatedUserPermissions){
        throw new ApiError(400, "User not found")
    }

    return res.status(200)
    .json(new ApiResponse(200, updatedUserPermissions, "Permissions removed successfully"))
})


export {
    showPermissions,
    addUserPermission,
    removePermissions
}