import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

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
