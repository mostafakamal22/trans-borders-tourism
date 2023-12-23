import { Router } from "express";
import { authAdminProtect } from "../middlewares/adminMiddlewares/authAdminProtect";
import {
  getPassports,
  deletePassport,
  updatePassport,
  createPassport,
  getOnePassport,
  getPassportsStatistics,
} from "../controllers/passportControllers";

const router = Router();

router.route("/").post(authAdminProtect, createPassport);

router.route("/statistics").get(authAdminProtect, getPassportsStatistics);

router.route("/query").post(authAdminProtect, getPassports);

router
  .route("/:id")
  .put(authAdminProtect, updatePassport)
  .get(authAdminProtect, getOnePassport)
  .delete(authAdminProtect, deletePassport);

export default router;
