import { Router } from "express";
import {
  deleteReceiptVoucher,
  updateReceiptVoucher,
  getReceiptVouchers,
  createReceiptVoucher,
  //   getReceiptVouchersStatistics,
  getOneReceiptVoucher,
} from "../controllers/receiptVoucherControllers";
import { authAdminProtect } from "../middlewares/adminMiddlewares/authAdminProtect";

const router = Router();

router.route("/").post(authAdminProtect, createReceiptVoucher);

// router.route("/statistics").get(authAdminProtect, getReceiptVouchersStatistics);

router.route("/query").post(authAdminProtect, getReceiptVouchers);

router
  .route("/:id")
  .get(authAdminProtect, getOneReceiptVoucher)
  .put(authAdminProtect, updateReceiptVoucher)
  .delete(authAdminProtect, deleteReceiptVoucher);

export default router;
