import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyProject } from "../middleware/project.middleware.js";
import { requireAnyPermission, requireProjectPermission } from "../middleware/requirePermissions.middleware.js";
import { callWorkflow, enableLogCleaner, getImageTagForEnvironment, startManualPatcher, stopWorkflow, streamPatcherLogs, streamWatcherLogs, streamWorkflowLogs } from "../controller/coreCaller.controller.js";



const router = Router();

router.route("/startWorkflow")
.get(verifyJWT, verifyProject, requireProjectPermission("workflow"), callWorkflow);

router.route("/stopWorkflow")
.get(verifyJWT, verifyProject, requireProjectPermission("workflow"), stopWorkflow);

router.route("/logs/workflow")
.get(verifyJWT, verifyProject, requireProjectPermission("workflow"), streamWorkflowLogs);

router.route("/logs/watcher")
.get(verifyJWT, verifyProject, requireProjectPermission("workflow"), streamWatcherLogs);

router.route("/logs/patcher/:envId")
.get(verifyJWT, verifyProject, requireProjectPermission("workflow"), streamPatcherLogs);

router.route("/logsCleaner")
.get(verifyJWT, verifyProject, requireProjectPermission("workflow"), enableLogCleaner);

router.route("/startManualPatcher/:environmentId")
.get(verifyJWT, verifyProject, requireProjectPermission("workflow"), startManualPatcher);

router.route("/getImageTagForEnvironment/:envId")
.get(verifyJWT, verifyProject, requireProjectPermission("show") , getImageTagForEnvironment);

export default router;