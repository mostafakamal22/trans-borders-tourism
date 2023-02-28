import { Router } from "express";
import {
  createVisa,
  deleteVisa,
  getVisas,
  updateVisa,
} from "../controllers/visaControllers";
import { authAdminProtect } from "../middlewares/adminMiddlewares/authAdminProtect";

const router = Router();

router.route("/").post(authAdminProtect, createVisa);

router.route("/query").post(authAdminProtect, getVisas);

router
  .route("/:id")
  .put(authAdminProtect, updateVisa)
  .delete(authAdminProtect, deleteVisa);

export default router;
