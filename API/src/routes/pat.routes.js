import { Router } from "express";
import {
    addPAT, 
    addPATinProject, 
    deletePAT, 
    removePATFromProject, 
    showAllPats, 
    showNonPATProjects, 
    showPATDetails, 
     } from "../controller/pat.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { requireAnyPermission, requirePatPermission } from "../middleware/requirePermissions.middleware.js";
import { verifyProject } from "../middleware/project.middleware.js";

const router = Router();

router.route("/addGithubPAT").post(verifyJWT, requirePatPermission("create"), addPAT)
router.route("/showPATDetails/:patId").get(verifyJWT,requirePatPermission("show"), showPATDetails)
router.route("/addPATinProject/:patId").post(verifyJWT, requirePatPermission("addPATInProject"), addPATinProject)
router.route("/deletePAT/:patId").delete(verifyJWT, requirePatPermission("delete"), deletePAT)
router.route("/showAllPAT").get(verifyJWT, showAllPats)
router.route("/filteredProjects/:patId").get(verifyJWT, requirePatPermission("show"), showNonPATProjects)
router.route("/removePATFromProject/:patId").post(verifyJWT, requirePatPermission("removePATFromProject"), removePATFromProject)

export default router