import { Router } from "express";
import { authAdminProtect } from "../middlewares/adminMiddlewares/authAdminProtect";
import {
  getBills,
  deleteBill,
  updateBill,
  createBill,
} from "../controllers/billControllers";

const router = Router();

router.route("/").post(authAdminProtect, createBill);

router.route("/query").post(authAdminProtect, getBills);

router
  .route("/:id")
  .put(authAdminProtect, updateBill)
  .delete(authAdminProtect, deleteBill);

export default router;
