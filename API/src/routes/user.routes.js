import { Router } from "express";
import { 
    changePassword,
    createRootAdmin,
    deleteUser,
    getAllUser,
    getMe, 
    loginUser, 
    logoutUser, 
    reclaimTokens, 
    registerUser,
    updateUser
 } from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { 
    addUserPermission,
    removePermissions,
    showPermissions
 } from "../controller/permissions.controller.js";
import { requireAnyPermission } from "../middleware/requirePermissions.middleware.js";
const router = Router();

router.route("/createRootAdmin").post(createRootAdmin)
router.route("/register").post(requireAnyPermission("admin"),registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(verifyJWT, logoutUser)
router.route("/currentUser").get(verifyJWT, getMe)
router.route("/allUsers").get(verifyJWT, getAllUser)
router.route("/reclaimTokens").get(verifyJWT, reclaimTokens)
router.route("/updateUserDetails").patch(verifyJWT, updateUser)
router.route("/changePassword").patch(verifyJWT, changePassword)
router.route("/deleteUser").delete(verifyJWT,requireAnyPermission("admin", "access_delete_user"), deleteUser)
router.route("/getPermission").get(showPermissions)
router.route("/addPermission").post(verifyJWT, requireAnyPermission("admin", "access_modify_permissions"), addUserPermission)
router.route("/removePermission").post(verifyJWT, requireAnyPermission("admin", "access_modify_permissions"), removePermissions)

export default router