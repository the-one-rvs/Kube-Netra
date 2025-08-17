import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const checkForGithubPAT = asyncHandler(async (req, res, next) => {
    try {
        if (!req.project) {
            throw new ApiError(400, "Unauthorized request Unable to find project")
        }
        if (!req.project.nameOfGithubPAT) {
            throw new ApiError(400, "Unauthorized request Project does not have any githubPAT")
        }
        next();
    } catch (error) {
        throw new ApiError(400, error?.message)
    }
});