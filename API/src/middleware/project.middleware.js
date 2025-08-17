import { Project } from "../models/project.model.js"
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"

export const verifyProject = asyncHandler(async(req, res, next) => {
    const { projectToken } = req.cookies?.projectToken

    if (!projectToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    const decodedToken = jwt.verify(projectToken, process.env.PROJECT_TOKEN_SECRET)

    if (!decodedToken) {
        throw new ApiError(401, "Invalid Project Token")
    }

    const project = await Project.findById(decodedToken?._id)
    if (!project){
        throw new ApiError(401, "Invalid Project Token")
    }

    req.project = project

    next()
})