import { Router } from "express";
import {
  createBank,
  getBanks,
  updateBank,
  deleteBank,
} from "../controllers/bankControllers";

const router = Router();

import { authAdminProtect } from "../middlewares/adminMiddlewares/authAdminProtect";

router
  .route("/")
  .post(authAdminProtect, createBank)
  .get(authAdminProtect, getBanks);

router
  .route("/:id")
  .put(authAdminProtect, updateBank)
  .delete(authAdminProtect, deleteBank);

export default router;
