import { Router } from "express";
import {
  updateAdmin,
  createAdmin,
  adminLogin,
  getOneAdmin,
  adminRefreshToken,
  AdminLogout,
  backupDatabase,
  getBackupUrl,
  restoreDatabase,
} from "../controllers/adminControllers";
import { validatePassword } from "../middlewares/adminMiddlewares/validatePassword";
import { authAdminProtect } from "../middlewares/adminMiddlewares/authAdminProtect";
import { checkPassword } from "../middlewares/adminMiddlewares/checkPassword";
import { comparePassword } from "../middlewares/adminMiddlewares/comparePasswords";

const router = Router();

router.route("/").post(authAdminProtect, validatePassword, createAdmin);

router.route("/login").post(adminLogin);

router.route("/refresh").get(adminRefreshToken);

router.route("/logout").get(authAdminProtect, AdminLogout);

router.route("/backup/url").get(authAdminProtect, getBackupUrl);

router.route("/backup/database").get(authAdminProtect, backupDatabase);

// router.route("/restore/database").post(authAdminProtect, restoreDatabase);

router
  .route("/:id")
  .get(authAdminProtect, getOneAdmin)
  .put(
    authAdminProtect,
    comparePassword,
    validatePassword,
    checkPassword,
    updateAdmin,
  );

export default router;
