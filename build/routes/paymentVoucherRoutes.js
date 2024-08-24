"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var paymentVoucherControllers_1 = require("../controllers/paymentVoucherControllers");
var authAdminProtect_1 = require("../middlewares/adminMiddlewares/authAdminProtect");
var router = (0, express_1.Router)();
router.route("/").post(authAdminProtect_1.authAdminProtect, paymentVoucherControllers_1.createPaymentVoucher);
// router.route("/statistics").get(authAdminProtect, getPaymentVouchersStatistics);
router.route("/query").post(authAdminProtect_1.authAdminProtect, paymentVoucherControllers_1.getPaymentVouchers);
router
    .route("/:id")
    .get(authAdminProtect_1.authAdminProtect, paymentVoucherControllers_1.getOnePaymentVoucher)
    .put(authAdminProtect_1.authAdminProtect, paymentVoucherControllers_1.updatePaymentVoucher)
    .delete(authAdminProtect_1.authAdminProtect, paymentVoucherControllers_1.deletePaymentVoucher);
exports.default = router;
