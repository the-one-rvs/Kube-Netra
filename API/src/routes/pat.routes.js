import { Router } from "express";
import {
    addPAT, 
    addPATinProject, 
    deletePAT, 
    showPATProjects } from "../controller/pat.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { requireAnyPermission } from "../middleware/requirePermissions.middleware.js";

const router = Router();

router.route("/addGithubPAT").post(verifyJWT,requireAnyPermission("admin", "access_add_pat"), addPAT)
router.route("/showPATProjects").get(verifyJWT, showPATProjects)
router.route("/addPATinProject").post(verifyJWT, requireAnyPermission("admin", "access_add_pat_in_project"), addPATinProject)
router.route("/deletePAT").delete(verifyJWT, requireAnyPermission("admin", "access_delete_pat"), deletePAT)

export default router