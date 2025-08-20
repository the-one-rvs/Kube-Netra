import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Project } from "../models/project.model.js";
import { GithubPAT } from "../models/githubPAT.model.js";
import { Environment } from "../models/env.model.js";

const getfullProjVars = asyncHandler(async(req, res) => {
    try {
        // fetch current project details 
        const current_proj = req.project;
        const proj = await Project.findById(current_proj._id).lean();

        const envs = proj.environments;

        // create a empty list of env details with envs.length()
        const all_env_details = new Array(envs.length+1);
        
        for (let i = 0; i < envs.length; i++) {
            const env = envs[i];
            const env_details = await Environment.findById(env._id).lean();
            const githubPAT = await GithubPAT.findOne({nameOfPAT: env_details.nameOfGithubPAT}).select("githubPAT githubUsername").lean();
            const enrichedEnvironment = {
                ...env_details,
                dockerImage: proj.dockerImage,
                nameOfGithubPAT: proj.nameOfGithubPAT,
                githubPAT: githubPAT?.githubPAT || null,
                githubUsername: githubPAT?.githubUsername || null
            };
            const env_number = enrichedEnvironment.environmentNumber;
            all_env_details[env_number] = enrichedEnvironment;
        }

        const final_proj = {
            ...proj,
            environments: all_env_details
        }
        
        return res.status(200)
        .json(new ApiResponse(200, final_proj, "Complete Project details fetched successfully"))

    } catch (error) {
        throw new ApiError(400, error?.message)
    }
})

const callWorkflow = asyncHandler(async(req, res) => {
    try {
        
    } catch (error) {
        throw new ApiError(400, error?.message)
    }
})