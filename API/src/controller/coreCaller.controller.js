import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Project } from "../models/project.model.js";
import { GithubPAT } from "../models/githubPAT.model.js";
import { Environment } from "../models/env.model.js";
import { spawn } from "child_process";

const callWorkflow = asyncHandler(async(req, res) => {
    try {
        const current_proj = req.project;
        const proj = await Project.findById(current_proj._id).lean();

        const envs = proj.environments;

        const all_env_details = new Array(envs.length);
        
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
            all_env_details[env_number-1] = enrichedEnvironment;
        }

        const final_proj_details = {
            ...proj,
            environments: all_env_details
        }

        const full_proj_details = JSON.stringify(final_proj_details)
        
        const child = spawn("../core/cli-workflow.sh", [], {
            cwd: "../core",
            env: {
                ...process.env,
                PROJ_NAME: full_proj_details.name,
                DOCKER_IMAGE: full_proj_details.dockerImage,
                POLL_INTERVAL: full_proj_details.poolInterval,
                ACCESS_TYPE: full_proj_details.imageType,
                TOKEN: full_proj_details.imageType === "private" ? full_proj_details.dockerhubPAT : "",
                USERNAME: full_proj_details.imageType === "private" ? full_proj_details.dockerhubUsername : "",
                ENV_DETAILS: JSON.stringify(full_proj_details.environments)
            }
        });

        child.stdout.on("data", (data) => {
            console.log(`stdout: ${data}`);
        });

        child.stderr.on("data", (data) => {
            console.error(`stderr: ${data}`);
        });

        child.on("close", (code) => {
            console.log(`child process exited with code ${code}`);
        });
        
    } catch (error) {
        throw new ApiError(400, error?.message)
    }
})

export{
    callWorkflow
}