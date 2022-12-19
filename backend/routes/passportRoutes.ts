import { Router } from "express";
import { authAdminProtect } from "../middlewares/adminMiddlewares/authAdminProtect";
import {
  getPassports,
  deletePassport,
  updatePassport,
  createPassport,
} from "../controllers/passportControllers";

const router = Router();

router
  .route("/")
  .post(authAdminProtect, createPassport)
  .get(authAdminProtect, getPassports);

router
  .route("/:id")
  .put(authAdminProtect, updatePassport)
  .delete(authAdminProtect, deletePassport);

export default router;
