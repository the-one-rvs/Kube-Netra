import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyProject } from "../middleware/project.middleware.js";
import { requireAnyPermission } from "../middleware/requirePermissions.middleware.js";
import { callWorkflow } from "../controller/coreCaller.controller.js";


const router = Router();

router.route("/startWorkflow")
.get(verifyJWT, verifyProject, requireAnyPermission("admin", "access_full_project", "access_start_workflow"), callWorkflow);


export default router;