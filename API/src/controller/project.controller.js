import jwt from "jsonwebtoken";
import { Project } from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { GithubPAT } from "../models/githubPAT.model.js";

const createProject = asyncHandler(async(req, res) => {
    try {
        
        const {
            name,
            dockerImage,
            poolInterval,
            imageType,
            dockerhubPAT,
            dockerhubUsername
        } = req.body

        if (!req.user) {
            throw new ApiError(400, "Unauthorized request")
        }

        if (!name || !dockerImage || !poolInterval || !imageType || !githubUsername || !githubPAT) {
            throw new ApiError(400, "All fields are required")
        }
        if (imageType === "private" && !dockerhubPAT) {
            throw new ApiError(400, "DockerHub PAT is required when imageType is private")
        }
        if (imageType === "private" && !dockerhubUsername) {
            throw new ApiError(400, "DockerHub Username is required when imageType is private")
        }

        const exsistingProject = await Project.findOne({ name })
        if (exsistingProject) {
            throw new ApiError(400, "Project already exists")
        }

        const project = await Project.create({
            name: name,
            dockerImage: dockerImage,
            poolInterval: poolInterval,
            imageType: imageType,
            createdBy: req.user._id
        })

        if (imageType === "private") {
            project.dockerhubPAT = dockerhubPAT
            project.dockerhubUsername = dockerhubUsername

            await project.save()
        }

        const projectId = project._id

        return res
        .status(200)
        .json(new ApiResponse(200, projectId, "Project created successfully"))

    } catch (error) {
        throw new ApiError(400, error?.message)
    }
})

const enterProject = asyncHandler(async(req, res) => {
    try {
        
        const { projectId } = req.params

        if (!req.user) {
            throw new ApiError(400, "Unauthorized request")
        }

        if (!projectId) {
            throw new ApiError(400, "Project ID not found")
        }

        const project = await Project.findById(projectId).select("-githubPAT -dockerhubPAT")
        if (!project) {
            throw new ApiError(400, "Project not found")
        }


        const projectToken = await jwt.sign({
            _id: project._id,
            name: project.name
        },
        process.env.PROJECT_TOKEN_SECRET,
        {
            expiresIn: process.env.PROJECT_TOKEN_EXPIRY
        }
        )
        const options = {
            secure: true,
            httpOnly: true
        }
        res.cookie("projectToken", projectToken, options)
        return res
        .status(200)
        .json(new ApiResponse(200, {} , "Project entered successfully"))

    } catch (error) {
        throw new ApiError(400, error?.message)
    }
})

const exitProject = asyncHandler(async(req, res) => {
    try {

        if (!req.user && !req.project) {
            throw new ApiError(400, "Unauthorized request")
        }

        const options = {
            secure: true,
            httpOnly: true
        }

        return res
        .status(200)
        .clearCookie("projectToken", options)
        .json(new ApiResponse(200, {}, "Project exited successfully"))

    } catch (error) {
        throw new ApiError(400, error?.message)
    }
})

const updateProject = asyncHandler(async(req, res) => {
    try {
        if (!req.user && !req.project) {
            throw new ApiError(400, "Unauthorized request")
        }

        const {
            name,
            dockerImage,
            poolInterval,
            imageType,
            githubUsername,
            githubPAT,
            dockerhubPAT,
            dockerhubUsername
        } = req.body

        const updateFields = {};
        if (name) updateFields.name = name;
        if (dockerImage) updateFields.dockerImage = dockerImage;
        if (poolInterval) updateFields.poolInterval = poolInterval;
        if (imageType) updateFields.imageType = imageType;
        if (githubUsername) updateFields.githubUsername = githubUsername;
        if (githubPAT) updateFields.githubPAT = githubPAT;
        if (imageType === "private") {
            if (dockerhubPAT) updateFields.dockerhubPAT = dockerhubPAT;
            if (dockerhubUsername) updateFields.dockerhubUsername = dockerhubUsername;
        }

        if (Object.keys(updateFields).length === 0) {
            throw new ApiError(400, "No fields provided for update");
        }

        const updatedProject = await Project.findByIdAndUpdate(
            req.project._id, 
            updateFields,
             {
                new: true , 
                runValidators: true  
            }
        ).select("-githubPAT -dockerhubPAT")

        return res
        .status(200)
        .json(new ApiResponse(200, updatedProject, "Project updated successfully"))
                
    } catch (error) {
        throw new ApiError(400, error?.message)
    }
})

const deleteProject = asyncHandler(async(req, res) => {
    try {
        if (!req.user && !req.project) {
            throw new ApiError(400, "Unauthorized request")
        }

        await Project.findByIdAndDelete(req.project._id)

        const options = {
            secure: true,
            httpOnly: true
        }

        return res
        .clearCookie("projectToken", options)
        .status(200)
        .json(new ApiResponse(200, {}, "Project deleted successfully"))

    } catch (error) {
        throw new ApiError(400, error?.message)
    }
})  

const getCurrentProjectDetails = asyncHandler(async(req, res) => {
    try {
        if (!req.user && !req.project) {
            throw new ApiError(400, "Unauthorized request")
        }

        const project = await Project.findById(req.project._id)
        if (!project) {
            throw new ApiError(400, "Project not found")
        }

        return res.status(200).json(new ApiResponse(200, project, "Project details found successfully"))
    } catch (error) {
        throw new ApiError(400, error?.message)
    }
})

const getAllProjects = asyncHandler(async(req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(400, "Unauthorized request")
        }

        const projects = await Project.find().select("-githubPAT -dockerhubPAT").populate("createdBy", "name")

        if (!projects) {
            throw new ApiError(400, "Projects not found")
        }

        return res.status(200).json(new ApiResponse(200, projects, "Projects found successfully"))

    } catch (error) {
        throw new ApiError(400, error?.message)
    }
})

export {
    createProject,
    enterProject,
    exitProject,
    updateProject,
    deleteProject,
    getCurrentProjectDetails,
    getAllProjects
}