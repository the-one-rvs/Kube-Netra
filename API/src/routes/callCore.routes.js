import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyProject } from "../middleware/project.middleware.js";
import { requireAnyPermission } from "../middleware/requirePermissions.middleware.js";
import { callWorkflow, stopWorkflow, streamPatcherLogs, streamWatcherLogs, streamWorkflowLogs } from "../controller/coreCaller.controller.js";


const router = Router();

router.route("/startWorkflow")
.get(verifyJWT, verifyProject, requireAnyPermission("admin", "access_full_project", "access_to_core"), callWorkflow);

router.route("/stopWorkflow")
.get(verifyJWT, verifyProject, requireAnyPermission("admin", "access_full_project", "access_to_core"), stopWorkflow);

router.route("/logs/workflow")
.get(verifyJWT, verifyProject, requireAnyPermission("admin", "access_full_project", "access_to_core"), streamWorkflowLogs);

router.route("/logs/watcher")
.get(verifyJWT, verifyProject, requireAnyPermission("admin", "access_full_project", "access_to_core"), streamWatcherLogs);

router.route("/logs/patcher/:envId")
.get(verifyJWT, verifyProject, requireAnyPermission("admin", "access_full_project", "access_to_core"), streamPatcherLogs);

export default router;