import { Router } from "express";
import {
  createBank,
  getBanks,
  updateBank,
  deleteBank,
} from "../controllers/bankControllers";
import { authAdminProtect } from "../middlewares/adminMiddlewares/authAdminProtect";

const router = Router();

router.route("/").post(authAdminProtect, createBank);

router.route("/query").post(authAdminProtect, getBanks);

router
  .route("/:id")
  .put(authAdminProtect, updateBank)
  .delete(authAdminProtect, deleteBank);

export default router;
