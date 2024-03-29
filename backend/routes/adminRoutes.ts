import { Router } from "express";
import {
  updateAdmin,
  createAdmin,
  adminLogin,
  getOneAdmin,
  adminRefreshToken,
  AdminLogout,
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

router
  .route("/:id")
  .get(authAdminProtect, getOneAdmin)
  .put(
    authAdminProtect,
    comparePassword,
    validatePassword,
    checkPassword,
    updateAdmin
  );

export default router;
