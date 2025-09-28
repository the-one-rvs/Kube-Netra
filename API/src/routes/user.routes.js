import { Router } from "express";
import { 
    changePassword,
    checkAdminExsists,
    createRootAdmin,
    deleteAnyUser,
    deleteUser,
    getAllUser,
    getMe, 
    getUserDetails, 
    loginUser, 
    logoutUser, 
    reclaimTokens, 
    registerUser,
    updateUser,
    validateToken
} from "../controller/user.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

import { 
    addUserPermission,
    removePermissions,
    showPermissions,
    addUserProjectPermission,
    removeUserProjectPermission,
    addUserPatPermission,
    removeUserPatPermission,
    showAllPermission
} from "../controller/permissions.controller.js";

import { requireAnyPermission } from "../middleware/requirePermissions.middleware.js";

const router = Router();


router.route("/createRootAdmin").post(createRootAdmin);
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/currentUser").get(verifyJWT, getMe);
router.route("/allUsers").get(verifyJWT, getAllUser);
router.route("/reclaimTokens").get(reclaimTokens);
router.route("/updateUserDetails").patch(verifyJWT, updateUser);
router.route("/changePassword").patch(verifyJWT, changePassword);
router.route("/deleteUser").delete(
    verifyJWT,
    requireAnyPermission("admin", "access_delete_user"),
    deleteUser
);
router.route("/checkAdminExsists").get(checkAdminExsists);
router.route("/validateToken").get(validateToken);
router.route("/getUser/:userId").get(verifyJWT, getUserDetails)


router.route("/getPermission").get(showPermissions);
router.route("/addPermissions/:userId").post(
    verifyJWT,
    requireAnyPermission("admin", "access_modify_permissions", "access_manage_team"),
    addUserPermission
);
router.route("/removePermission").post(
    verifyJWT,
    requireAnyPermission("admin", "access_modify_permissions", "access_manage_team"),
    removePermissions
);


router.route("/addProjectPermission/:userId").post(
    verifyJWT,
    requireAnyPermission("admin", "access_modify_permissions", "access_manage_team"),
    addUserProjectPermission
);
router.route("/removeProjectPermission/:userId").post(
    verifyJWT,
    requireAnyPermission("admin", "access_modify_permissions", "access_manage_team"),
    removeUserProjectPermission
);


router.route("/addPatPermission/:userId").post(
    verifyJWT,
    requireAnyPermission("admin", "access_modify_permissions", "access_manage_team"),
    addUserPatPermission
);
router.route("/removePatPermission/:userId").post(
    verifyJWT,
    requireAnyPermission("admin", "access_modify_permissions", "access_manage_team"),
    removeUserPatPermission
);

router.route("/getPermission/:userId").get(
    verifyJWT,
    showAllPermission
);

router.route("/deleteUser/:userId").delete(
    verifyJWT,
    requireAnyPermission("admin", "access_manage_team"),
    deleteAnyUser
);

export default router;
