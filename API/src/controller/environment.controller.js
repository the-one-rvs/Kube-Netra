import { Environment } from "../models/env.model.js";
import { GithubPAT } from "../models/githubPAT.model.js";
import { Project } from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createEnvironment = asyncHandler(async(req, res) => {
    try {
       
        const {
            environmentName,
            gitRepo,
            helmValuePath,
            mode,
            branch
        } = req.body

        if (!environmentName || !environmentNumber || !gitRepo || !helmValuePath || !mode || !branch) {
            throw new ApiError(404, "All fields are required")
        }

        if (!req.user) {
            throw new ApiError(404, "Unauthorized request")
        }

        if (!req.project) {
            throw new ApiError(404, "Project not found")
        }

        const environment = await Environment.create({
            environmentName,
            projectId: req.project._id,
            gitRepo,
            helmValuePath,
            mode,
            branch
        })

        const proj = await Project.findById(req.project._id)
        proj.environments.push(environment._id)
        await proj.save()

        if (!environment) {
            throw new ApiError(400, "Environment not created")
        }
        return res
        .status(200)
        .json ( new ApiResponse(200, environment, "Environment Created"))

    } catch (error) {
        throw new ApiError(400, error?.message)
    }
})

const deleteEnvironment = asyncHandler(async(req, res) => {
    try {
      const {environmentId} = req.params

      if (!req.user) {
        throw new ApiError(404, "Unauthorized request")
    }

        if (!req.project) {
            throw new ApiError(404, "Project not found")
        }
    
      if (!environmentId) {
          throw new ApiError(400, "Environment ID not found")
      }

      const environment = await Environment.findByIdAndDelete(environmentId)
      return res
      .status(200)
      .json ( new ApiResponse(200, environment, "Environment Deleted"))
    } catch (error) {
        throw new ApiError(400, error?.message)
    }
})

const getAllEnvironment = asyncHandler(async(req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(404, "Unauthorized request")
        }
        if (!req.project) {
            throw new ApiError(404, "Project not found")
        }
        const environments = await Environment.find({projectId: req.project._id})
        return res
        .status(200)
        .json ( new ApiResponse(200, environments, "Environments found"))
    } catch (error) {
        throw new ApiError(400, error?.message)
    }
})

const getEnvironment = asyncHandler(async(req, res) => {
    try {
        const {projectId, environmentNumber} = req.params

        if (!req.user) {
            throw new ApiError(404, "Unauthorized request")
        }

        if (!req.project) {
            throw new ApiError(404, "Project not found")
        }

        if (req.project._id !== projectId) {
            throw new ApiError(404, "Unauthorized to perform action")
        }

        const environment = await Environment.findOne({
            projectId: projectId, 
            environmentNumber: environmentNumber
        })

        if (!environment) {
            throw new ApiError(404, "Environment not found")
        }

        return res
        .status(200)
        .json ( new ApiResponse(200, environment, "Environment found"))
    }
    catch(error){
        throw new ApiError(400, (error?.message))
    }
})

const updateEnvironment = asyncHandler(async(req, res) => {
    try {
       const {
        environmentName,
        gitRepo,
        helmValuePath,
        mode,
        branch
       } = req.body

       const {environmentId} = req.params

       const updateFields = {};
       if (environmentName) updateFields.environmentName = environmentName;
       if (gitRepo) updateFields.gitRepo = gitRepo;
       if (helmValuePath) updateFields.helmValuePath = helmValuePath;
       if (mode) updateFields.mode = mode;
       if (branch) updateFields.branch = branch;

       if (Object.keys(updateFields).length === 0) {
        throw new ApiError(400, "No fields provided for update");
       }

       if (!req.user) {
        throw new ApiError(404, "Unauthorized request")
       }

       if (!req.project) {
        throw new ApiError(404, "Project not found")
       }

       const updatedEnvironment = await Environment.findByIdAndUpdate(
            environmentId, 
            updateFields,
            {
                new: true , 
                runValidators: true  
            }
        )

        return res
        .status(200)
        .json ( new ApiResponse(200, updatedEnvironment, "Environment updated"))
       
    } catch (error) {
        throw new ApiError(400, error?.message)
    }
})

export{
    createEnvironment,
    deleteEnvironment,
    getAllEnvironment,
    getEnvironment,
    updateEnvironment
}