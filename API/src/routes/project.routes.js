import { Router } from "express";
import { 
    createProject,
    deleteProject,
    enterProject,
    exitProject,
    getAllProjects,
    getCurrentProjectDetails,
    updateProject
 } from "../controller/project.controller.js";
import { verifyProject } from "../middleware/project.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { requireAnyPermission } from "../middleware/requirePermissions.middleware.js";
import { validateDockerImage } from "../middleware/checkDockerImage.middleware.js";

const router = Router();

router.route("/createProject").post(verifyJWT, requireAnyPermission("admin", "access_create_project", "access_full_project"), validateDockerImage, createProject)
router.route("/enterProject/:projectId").get(verifyJWT, requireAnyPermission("admin", "access_view_project","access_full_project"), enterProject)
router.route("/exitProject").get(verifyJWT, verifyProject, requireAnyPermission("admin", "access_view_project","access_full_project"), exitProject)
router.route("/updateProject").patch(verifyJWT, verifyProject,requireAnyPermission("admin","access_update_project", "access_full_project"), updateProject)
router.route("/deleteProject").delete(verifyJWT, verifyProject, requireAnyPermission("admin", "access_delete_project", "access_full_project"), deleteProject)
router.route("/getCurrentProjectDetails").get(verifyJWT, verifyProject, requireAnyPermission("admin", "access_view_details", "access_full_project"), getCurrentProjectDetails)
router.route("/getAllProjects").get(verifyJWT, requireAnyPermission("admin", "access_view_project", "access_full_project"), getAllProjects)

export default router