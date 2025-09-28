import { Router } from "express";
import { 
    createProject,
    deleteProject,
    doAlterFavorite,
    enterProject,
    exitProject,
    getAllProjects,
    getCurrentProjectDetails,
    updateProject
 } from "../controller/project.controller.js";
import { verifyProject } from "../middleware/project.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { requireAnyPermission, requireProjectPermission } from "../middleware/requirePermissions.middleware.js";
import { validateDockerImage } from "../middleware/checkDockerImage.middleware.js";

const router = Router();

router.route("/createProject")
.post(verifyJWT, requireAnyPermission("admin", "access_create_project"), validateDockerImage, createProject)
router.route("/enterProject/:projectId")
.get(verifyJWT, requireAnyPermission("admin", "access_enter/exit_project"), enterProject)
router.route("/exitProject")
.get(verifyJWT, requireAnyPermission("admin", "access_enter/exit_project"), exitProject)
router.route("/updateProject")
.patch(verifyJWT, verifyProject, requireProjectPermission("edit") , updateProject)
router.route("/deleteProject")
.delete(verifyJWT, verifyProject, requireProjectPermission("delete"), deleteProject)
router.route("/getCurrentProjectDetails")
.get(verifyJWT, verifyProject, requireProjectPermission("show"), getCurrentProjectDetails)
router.route("/getAllProjects")
.get(verifyJWT, getAllProjects)
router.route("/alterFaviorates")
.post(verifyJWT, doAlterFavorite)

export default router