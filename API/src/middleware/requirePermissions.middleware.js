import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ProjectPermissions } from "../models/projectPermissions.model.js"
import { PatPermissions } from "../models/patPermission.model.js";

export const requirePatPermission = (...allowedTypes) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?._id;
      const patId = req.params.patId || req.body.patId;

      const user = await User.findById(userId).select("permissions");
      if (user.permissions.includes("admin")) {
        return next();
      }

      if (adminAccess) {
        return next();
      }

      if (!userId) throw new ApiError(401, "Unauthorized");
      if (!patId) throw new ApiError(400, "PAT ID missing");

      const permission = await PatPermissions.findOne({ userId, patId });
      if (!permission) throw new ApiError(403, "No PAT permissions found");

      if (!allowedTypes.includes(permission.type)) {
        throw new ApiError(403, "You do not have required PAT permission");
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};


export const requireAnyPermission = (...allowedPermissions) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?._id;
      if (!userId) throw new ApiError(401, "Unauthorized");

      const user = await User.findById(userId).select("permissions");
      if (!user) throw new ApiError(404, "User not found");

      const hasPermission = allowedPermissions.some(p =>
        user.permissions.includes(p)
      );

      if (!hasPermission) {
        throw new ApiError(403, "You do not have required permissions");
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};


export const requireProjectPermission = (...allowedTypes) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?._id;
      const projectId = req.project?._id;

      if (!userId) throw new ApiError(401, "Unauthorized Please LogIn");
      if (!projectId) throw new ApiError(400, "Project ID missing");

      const user = await User.findById(userId).select("permissions");
      // console.log(user);

      // 🔹 Global admin bypass
      if (user.permissions.includes("admin")) {
        return next();
      }

      // 🔹 Project-specific permission check
      const permission = await ProjectPermissions.findOne({ userId, projectId });
      if (!permission) throw new ApiError(403, "No project permissions found");

      if (!allowedTypes.includes(permission.type)) {
        throw new ApiError(403, "You do not have required project permission");
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
