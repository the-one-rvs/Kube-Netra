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
import { requireAnyPermission } from "../middleware/requirePermissions.middleware.js";
import { validateGitHubRepo } from "../middleware/checkGitHubRepo.middleware.js";


const router = Router();

router
.route("/createEnvironment")
.get(verifyJWT, verifyProject, requireAnyPermission("admin", "access_create_environment", "access_full_project", "access_full_environment"), validateGitHubRepo, createEnvironment)

router
.route("/getEnvironment/:projectId/:environmentNumber")
.get(verifyJWT, verifyProject, requireAnyPermission("admin", "access_view_environment"), getEnvironment)

router
.route("/updateEnvironment")
.patch(verifyJWT, verifyProject, requireAnyPermission("admin", "access_update_environment", "access_full_project", "access_full_environment"), updateEnvironment)

router
.route("/getAllEnvironment")
.get(verifyJWT, verifyProject,requireAnyPermission("admin", "access_view_environment", "access_full_project", "access_full_environment"), getAllEnvironment)

router
.route("/deleteEnvironment")
.delete(verifyJWT, verifyProject,requireAnyPermission("admin", "access_delete_environment", "access_full_project", "access_full_environment"), deleteEnvironment)

export default router