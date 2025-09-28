import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyProject } from "../middleware/project.middleware.js";
import { 
    createEnvironment,
    deleteEnvironment,
    getAllEnvironment,
    getEnvironment,
    updateEnvironment
} from "../controller/environment.controller.js";
import { validateGitHubRepo } from "../middleware/checkGitHubRepo.middleware.js";
import { checkForGithubPAT } from "../middleware/checkforPAT.middleware.js";


const router = Router();

router
.route("/createEnvironment")
.post(verifyJWT, verifyProject, checkForGithubPAT, validateGitHubRepo, createEnvironment)

router
.route("/getEnvironment/:projectId/:environmentNumber")
.get(verifyJWT, verifyProject, getEnvironment)

router
.route("/updateEnvironment/:environmentId")
.patch(verifyJWT, verifyProject,validateGitHubRepo, updateEnvironment)

router
.route("/getAllEnvironment")
.get(verifyJWT, verifyProject, getAllEnvironment)

router
.route("/deleteEnvironment/:environmentId")
.delete(verifyJWT, verifyProject, deleteEnvironment)

export default router