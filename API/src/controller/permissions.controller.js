import { ProjectPermissions } from "../models/projectPermissions.model.js";
import { PatPermissions } from "../models/patPermission.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { PERMISSION_LIST } from "../utils/permissions.js";
import { Project } from "../models/project.model.js";
import { GithubPAT } from "../models/githubPAT.model.js";

/* ✅ Global Permissions */
const showPermissions = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, PERMISSION_LIST, "Permissions list found successfully")
    );
});

const addUserPermission = asyncHandler(async (req, res) => {
    const { newPermissions } = req.body;
    const { userId } = req.params;

    if (!newPermissions) throw new ApiError(400, "Permissions not found");
    if (userId === req.user._id.toString()) throw new ApiError(400, "You cannot add permissions to yourself");
    if (!Array.isArray(newPermissions)) throw new ApiError(400, "Permissions must be an array");
    if (!userId) throw new ApiError(400, "User id not found");

    const updatedUserPermissions = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { permissions: { $each: newPermissions } } },
        { new: true }
    ).select("permissions -_id");

    if (!updatedUserPermissions) throw new ApiError(400, "User not found");

    return res.status(200).json(
        new ApiResponse(200, updatedUserPermissions, "Permissions added successfully")
    );
});

const removePermissions = asyncHandler(async (req, res) => {
    const { permissionsToRemove } = req.body;
    const { userId } = req.params;

    if (!permissionsToRemove) throw new ApiError(400, "Permissions not found");
    if (userId === req.user._id.toString()) throw new ApiError(400, "You cannot remove permissions from yourself");
    if (!Array.isArray(permissionsToRemove)) throw new ApiError(400, "Permissions must be an array");
    if (!userId) throw new ApiError(400, "User id not found");

    const updatedUserPermissions = await User.findByIdAndUpdate(
        userId,
        { $pull: { permissions: { $in: permissionsToRemove } } },
        { new: true, runValidators: true }
    ).select("permissions -_id");

    if (!updatedUserPermissions) throw new ApiError(400, "User not found");

    return res.status(200).json(
        new ApiResponse(200, updatedUserPermissions, "Permissions removed successfully")
    );
});

/* ✅ Project Permissions */
const addUserProjectPermission = asyncHandler(async (req, res) => {
    try {
        const { type, projectName } = req.body;
        const { userId } = req.params;
    
        if (!type || !projectName) throw new ApiError(400, "Project permission type or project ID missing");
    
        const projectId = await Project.findOne({ name: projectName }).select("_id");
    
        if (!projectId) throw new ApiError(400, "Project not found");
    
        const newPermission = await ProjectPermissions.create({
            userId,
            projectId,
            type,
        });
    
        return res.status(200).json(
            new ApiResponse(200, newPermission, "Project permission added successfully")
        );
    } catch (error) {
        throw new ApiError(400, error?.message)
    }
});

const removeUserProjectPermission = asyncHandler(async (req, res) => {
    try {
        const { type, projectName } = req.body;
        const { userId } = req.params;
    
        if (!type || !projectName) throw new ApiError(400, "Project permission type or project ID missing");
    
        const projectId = await Project.findOne({ name: projectName }).select("_id");
    
        if (!projectId) throw new ApiError(400, "Project not found");
    
        const deleted = await ProjectPermissions.findOneAndDelete({
            userId,
            projectId,
            type,
        });
    
        if (!deleted) throw new ApiError(404, "Project permission not found");
    
        return res.status(200).json(
            new ApiResponse(200, deleted, "Project permission removed successfully")
        );
    } catch (error) {
        throw new ApiError(400, error?.message)
    }
});

/* ✅ PAT Permissions */
const addUserPatPermission = asyncHandler(async (req, res) => {
    try {
        const { type, patName } = req.body;
        const { userId } = req.params;
    
        if (!type || !patName) throw new ApiError(400, "PAT permission type or PAT ID missing");
    
        const patId = await GithubPAT.findOne({ nameOfPAT: patName }).select("_id");
    
        if (!patId) throw new ApiError(400, "PAT not found");
    
        const newPermission = await PatPermissions.create({
            userId,
            patId,
            type,
        });
    
        return res.status(200).json(
            new ApiResponse(200, newPermission, "PAT permission added successfully")
        );
    } catch (error) {
        throw new ApiError(400, error?.message)
    }
});

const removeUserPatPermission = asyncHandler(async (req, res) => {
    try {
        const { type, patName } = req.body;
        const { userId } = req.params;
    
    
        if (!type || !patName) throw new ApiError(400, "PAT permission type or PAT ID missing");
    
        const patId = await GithubPAT.findOne({ nameOfPAT: patName }).select("_id");
    
        if (!patId) throw new ApiError(400, "PAT not found");
    
    
        const deleted = await PatPermissions.findOneAndDelete({
            userId,
            patId,
            type,
        });
    
        if (!deleted) throw new ApiError(404, "PAT permission not found");
    
        return res.status(200).json(
            new ApiResponse(200, deleted, "PAT permission removed successfully")
        );
    } catch (error) {
        throw new ApiError(400, error?.message)
    }
});

export const showAllPermission = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
  
    // 1. Normal user-level permissions
    const user = await User.findById(userId).select("permissions").lean();
    let allPermissions = [...(user?.permissions || [])];
  
    // 2. Project Permissions
    const projectPerms = await ProjectPermissions.find({ userId })
      .populate("projectId", "name")
      .lean();
  
    projectPerms.forEach((pp) => {
      if (pp.projectId?.name) {
        allPermissions.push(`access_project:${pp.projectId.name}:${pp.type}`);
      }
    });
  
    // 3. PAT Permissions
    const patPerms = await PatPermissions.find({ userId })
      .populate("patId", "nameOfPAT")
      .lean();
  
    patPerms.forEach((pat) => {
      if (pat.patId?.nameOfPAT) {
        allPermissions.push(`access_pat:${pat.patId.nameOfPAT}:${pat.type}`);
      }
    });
  
    return res.status(200).json({
      success: true,
      permissions: allPermissions,
    });
  } catch (error) {
    console.log(error);
  }
});

export {
    showPermissions,
    addUserPermission,
    removePermissions,
    addUserProjectPermission,
    removeUserProjectPermission,
    addUserPatPermission,
    removeUserPatPermission
};
