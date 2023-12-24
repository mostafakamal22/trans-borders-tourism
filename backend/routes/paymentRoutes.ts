import { Router } from "express";
import {
  getPayments,
  createPayment,
  deletePayment,
  updatePayment,
  getOnePayment,
} from "../controllers/paymentControllers";
import { authAdminProtect } from "../middlewares/adminMiddlewares/authAdminProtect";

const router = Router();

router.route("/").post(authAdminProtect, createPayment);

router.route("/query").post(authAdminProtect, getPayments);

router
  .route("/:id")
  .get(authAdminProtect, getOnePayment)
  .put(authAdminProtect, updatePayment)
  .delete(authAdminProtect, deletePayment);

export default router;
