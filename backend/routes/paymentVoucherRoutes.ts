import { Router } from "express";
import {
  deletePaymentVoucher,
  updatePaymentVoucher,
  getPaymentVouchers,
  createPaymentVoucher,
  //   getPaymentVouchersStatistics,
  getOnePaymentVoucher,
} from "../controllers/paymentVoucherControllers";
import { authAdminProtect } from "../middlewares/adminMiddlewares/authAdminProtect";

const router = Router();

router.route("/").post(authAdminProtect, createPaymentVoucher);

// router.route("/statistics").get(authAdminProtect, getPaymentVouchersStatistics);

router.route("/query").post(authAdminProtect, getPaymentVouchers);

router
  .route("/:id")
  .get(authAdminProtect, getOnePaymentVoucher)
  .put(authAdminProtect, updatePaymentVoucher)
  .delete(authAdminProtect, deletePaymentVoucher);

export default router;
