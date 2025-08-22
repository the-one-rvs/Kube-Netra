import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Project } from "../models/project.model.js";
import { GithubPAT } from "../models/githubPAT.model.js";
import { Environment } from "../models/env.model.js";
import { spawn, exec } from "child_process";
import { ApiResponse } from "../utils/ApiResponse.js";
import { promisify } from "util";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scriptPath = path.join(__dirname, "../../core/workflow.sh");


const execAsync = promisify(exec);

const callWorkflow = asyncHandler(async(req, res) => {
    try {
        const current_proj = req.project;
        const proj = await Project.findById(current_proj._id).lean();

        const envs = proj.environments;

        const all_env_details = new Array(envs.length);
        
        for (let i = 0; i < envs.length; i++) {
            const env = envs[i];
            const env_details = await Environment.findById(env._id).lean();
            const githubPAT = await GithubPAT.findOne({nameOfPAT: proj.nameOfGithubPAT}).lean();
            console.log(githubPAT)
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

        console.log(full_proj_details)

        // await execAsync("chmod +x ../../core/workflow.sh");

        const env = {
            ...process.env, // apna current env bhi preserve karna
            PROJ_NAME: req.project.name,
            DOCKER_IMAGE: req.project.dockerImage,
            POLL_INTERVAL: req.project.poolInterval,
            ACCESS_TYPE: req.project.accessType || "public",
            ENV_DETAILS: full_proj_details, // array to string
        };
        
        const child = spawn(scriptPath, {
            env,
            cwd: path.resolve("core"),
            shell: true
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
        
        return res
        .status(200)
        .json(new ApiResponse(200, {}, "Workflow triggered successfully"))
    } catch (error) {
        throw new ApiError(400, error?.message)
    }
})

export{
    callWorkflow
}