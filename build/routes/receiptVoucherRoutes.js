"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var receiptVoucherControllers_1 = require("../controllers/receiptVoucherControllers");
var authAdminProtect_1 = require("../middlewares/adminMiddlewares/authAdminProtect");
var router = (0, express_1.Router)();
router.route("/").post(authAdminProtect_1.authAdminProtect, receiptVoucherControllers_1.createReceiptVoucher);
// router.route("/statistics").get(authAdminProtect, getReceiptVouchersStatistics);
router.route("/query").post(authAdminProtect_1.authAdminProtect, receiptVoucherControllers_1.getReceiptVouchers);
router
    .route("/:id")
    .get(authAdminProtect_1.authAdminProtect, receiptVoucherControllers_1.getOneReceiptVoucher)
    .put(authAdminProtect_1.authAdminProtect, receiptVoucherControllers_1.updateReceiptVoucher)
    .delete(authAdminProtect_1.authAdminProtect, receiptVoucherControllers_1.deleteReceiptVoucher);
exports.default = router;
