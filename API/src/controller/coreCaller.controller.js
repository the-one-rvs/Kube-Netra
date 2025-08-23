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
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scriptPath = path.join(__dirname, "../../core/workflow.sh");
const cleanupScriptPath = path.join(__dirname, "../../core/cleanup.sh");

const execAsync = promisify(exec);

const callWorkflow = asyncHandler(async(req, res) => {
    try {
        const current_proj = req.project;
        const proj = await Project.findById(current_proj._id).lean();

        if (proj.isWorkflowTriggered===true) {
            throw new ApiError(400, "Workflow already triggered")
        }

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

        // console.log(full_proj_details)

        await execAsync(`chmod +x ${scriptPath}`);

        const env = {
            ...process.env, 
            PROJ_NAME: req.project.name,
            DOCKER_IMAGE: req.project.dockerImage,
            POLL_INTERVAL: req.project.poolInterval,
            ACCESS_TYPE: req.project.accessType || "public",
            ENV_DETAILS: full_proj_details, 
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

        //kuch aisa karo jisse ye hojaye ki workflow triggred ho rha hai
        const proj_schema = await Project.findById(current_proj._id)
        proj_schema.isWorkflowTriggered = true
        await proj_schema.save()
        
        return res
        .status(200)
        .json(new ApiResponse(200, {}, "Workflow triggered successfully"))
    } catch (error) {
        throw new ApiError(400, error?.message)
    }
})

const streamWorkflowLogs = asyncHandler(async (req, res) => {
  
  if (!req.project) {
    throw new ApiError(404, "Project not found")
  }

  if (req.project.isWorkflowTriggered===false || !req.project.isWorkflowTriggered) {
    throw new ApiError(400, "Workflow not triggered")
  }

  const workflow_logs_file = path.join(__dirname, `../../core/logs/${req.project.name}-workflow.log`);
  if (!fs.existsSync(workflow_logs_file)) {
    throw new ApiError(400, "Workflow logs file not found");
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.write("data: Connected to live logs...\n\n");

  const logProcess = spawn("tail", ["-n", "100", "-f", workflow_logs_file]);

  logProcess.stdout.on("data", (data) => {
    res.write(`data: ${data.toString()}\n\n`);
  });

  logProcess.stderr.on("data", (data) => {
    res.write(`data: ERROR: ${data.toString()}\n\n`);
  });

  logProcess.on("close", (code) => {
    res.write(`data: Log stream closed with code ${code}\n\n`);
    res.end();
  });

  req.on("close", () => {
    logProcess.kill();
  });
});

const streamWatcherLogs = asyncHandler(async (req, res) => {
  
  if (!req.project) {
    throw new ApiError(404, "Project not found")
  }

  if (req.project.isWorkflowTriggered===false || !req.project.isWorkflowTriggered) {
    throw new ApiError(400, "Workflow not triggered")
  }

  const safeDockerImage = req.project.dockerImage.replace(/\//g, ":");
  const watcher_logs_file = path.join(__dirname, `../../core/logs/${safeDockerImage}-watch.sh.log`);
  if (!fs.existsSync(watcher_logs_file)) {
    throw new ApiError(400, "Watcher logs file not found");
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.write("data: Connected to live logs...\n\n");

  const logProcess = spawn("tail", ["-n", "100", "-f", watcher_logs_file]);

  logProcess.stdout.on("data", (data) => {
    res.write(`data: ${data.toString()}\n\n`);
  });

  logProcess.stderr.on("data", (data) => {
    res.write(`data: ERROR: ${data.toString()}\n\n`);
  });

  logProcess.on("close", (code) => {
    res.write(`data: Log stream closed with code ${code}\n\n`);
    res.end();
  });

  req.on("close", () => {
    logProcess.kill();
  });
});

const streamPatcherLogs = asyncHandler(async (req, res) => {
  
  const {envId} = req.paramas

  if (!req.user){
    throw new ApiError(404, "Unauthorized request")
  }

  if (!req.project) {
    throw new ApiError(404, "Project not found")
  }

  if (req.project.isWorkflowTriggered===false || !req.project.isWorkflowTriggered) {
    throw new ApiError(400, "Workflow not triggered")
  }

  if (!env) {
      throw new ApiError(404, "Environment not found")
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.write("data: Connected to live logs...\n\n");

  const env = await Environment.findById(envId)
  
  const patcher_logs_file = path.join(__dirname, `../../core/logs/${env.environmentName}-${req.project.name}-${env.mode}-patcher.log`);
  if (!fs.existsSync(patcher_logs_file)) {
    res.write(`Patchers are still not triggered\n\n`);
  }

  const logProcess = spawn("tail", ["-n", "100", "-f", patcher_logs_file]);

  logProcess.stdout.on("data", (data) => {
    res.write(`data: ${data.toString()}\n\n`);
  });

  logProcess.stderr.on("data", (data) => {
    res.write(`data: ERROR: ${data.toString()}\n\n`);
  });

  logProcess.on("close", (code) => {
    res.write(`data: Log stream closed with code ${code}\n\n`);
    res.end();
  });

  req.on("close", () => {
    logProcess.kill();
  });
});

const stopWorkflow = asyncHandler(async (req, res) => {
  try {
    if (!req.user){
      throw new ApiError(404, "Unauthorized request")
    }

    if (!req.project) {
      throw new ApiError(404, "Project not found")
    }

    if (req.project.isWorkflowTriggered===false || !req.project.isWorkflowTriggered) {
      throw new ApiError(400, "Workflow not triggered")
    }

    await execAsync(`chmod +x ${cleanupScriptPath}`);

    const env = {
        ...process.env, 
        PROJ_NAME: req.project.name,
        DOCKER_IMAGE: req.project.dockerImage 
    };
    
    const child = spawn(cleanupScriptPath, {
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

    const proj_schema = await Project.findById(req.project._id)
    proj_schema.isWorkflowTriggered = false
    await proj_schema.save()

    return res.status(200)
    .json(new ApiResponse(200, {}, "Workflow stopped successfully"))

  } catch (error) {
    throw new ApiError(400, error?.message)
  }
})

export{
    callWorkflow,
    streamWorkflowLogs,
    streamWatcherLogs,
    streamPatcherLogs,
    stopWorkflow
}