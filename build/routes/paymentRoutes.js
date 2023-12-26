"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var paymentControllers_1 = require("../controllers/paymentControllers");
var authAdminProtect_1 = require("../middlewares/adminMiddlewares/authAdminProtect");
var router = (0, express_1.Router)();
router.route("/").post(authAdminProtect_1.authAdminProtect, paymentControllers_1.createPayment);
router.route("/query").post(authAdminProtect_1.authAdminProtect, paymentControllers_1.getPayments);
router
    .route("/:id")
    .get(authAdminProtect_1.authAdminProtect, paymentControllers_1.getOnePayment)
    .put(authAdminProtect_1.authAdminProtect, paymentControllers_1.updatePayment)
    .delete(authAdminProtect_1.authAdminProtect, paymentControllers_1.deletePayment);
exports.default = router;
