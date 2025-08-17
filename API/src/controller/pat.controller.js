import { GithubPAT } from "../models/githubPAT.model.js";
import { Project } from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addPAT = asyncHandler(async(req, res) => {
    try {
        
        const {nameofPAT, githubUsername, githubPAT} = req.body

        if (!nameofPAT || !githubUsername || !githubPAT) {
            throw new ApiError(404, "All fields are required")
        }

        if (!req.user) {
            throw new ApiError(404, "Unauthorized request")
        }

        const pat = await GithubPAT.create({
            nameOfPAT: nameofPAT,
            githubUsername: githubUsername,
            githubPAT: githubPAT
        })

    } catch (error) {
        throw new ApiError(400, error?.message)
    }
})

const addPATinProject = asyncHandler(async(req, res) => {
    try {
        
        const { nameOfPAT } = req.body

        if (!req.user && !req.project) {
            throw new ApiError(400, "Unauthorized request")
        }

        if (!nameOfPAT) {
            throw new ApiError(400, "PAT name is required")
        }

        const githubPAT = await GithubPAT.findOne({ nameOfPAT })
        if (!githubPAT) {
            throw new ApiError(400, "PAT not found")
        }

        githubPAT.projects.push(req.project._id)
        await githubPAT.save()

        const project = await Project.findById(req.project._id).select("-dockerhubPAT")
        project.nameOfGithubPAT = nameOfPAT
        await project.save()

        return res
        .status(200)
        .json(new ApiResponse(200, project, "PAT added to project successfully"))
    }

    catch (error) {
        throw new ApiError(400, error?.message)
    }
})

const showPATProjects = asyncHandler(async(req, res) => {
    try {
        
        if (!req.user) {
            throw new ApiError(400, "Unauthorized request")
        }

        const {patId} = req.params

        if (!patId) {
            throw new ApiError(400, "PAT ID not found")
        }

        const pat = await GithubPAT.findById(patId).select("-githubPAT")
        if (!pat) {
            throw new ApiError(400, "PAT not found")
        }

        return res.status(200).json(new ApiResponse(200, pat, "PAT found successfully"))

    } catch (error) {
        throw new ApiError(400, error?.message)
    }
})

const deletePAT = asyncHandler(async(req, res) => {
    try {
      const {patId} = req.params

      if (!req.user) {
          throw new ApiError(404, "Unauthorized request")
      }

      if (!patId) {
          throw new ApiError(400, "PAT ID not found")
      }

      const pat = await GithubPAT.findById(patId).select("-githubPAT")
      if (!pat) {
          throw new ApiError(400, "PAT not found")
      }
      
      await Project.updateMany(
        { _id: { $in: pat.projects } },   
        { $pull: { nameOfGithubPAT: pat.nameOfPAT } }  
      );
      await GithubPAT.findByIdAndDelete(patId)
      return res
      .status(200)
      .json ( new ApiResponse(200, pat, "PAT Deleted"))
      
    } catch (error) {
        throw new ApiError(400, error?.message)
    }
})

export {
    addPAT,
    addPATinProject,
    showPATProjects,
    deletePAT
}