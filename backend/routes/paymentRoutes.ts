import { Router } from "express";
import {
  getPayments,
  createPayment,
  deletePayment,
  updatePayment,
} from "../controllers/paymentControllers";
import { authAdminProtect } from "../middlewares/adminMiddlewares/authAdminProtect";

const router = Router();

router
  .route("/")
  .post(authAdminProtect, createPayment)
  .get(authAdminProtect, getPayments);

router
  .route("/:id")
  .put(authAdminProtect, updatePayment)
  .delete(authAdminProtect, deletePayment);

export default router;
