"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var paymentControllers_js_1 = require("../controllers/paymentControllers.js");
var authAdminProtect_js_1 = require("../middlewares/adminMiddlewares/authAdminProtect.js");
var router = (0, express_1.Router)();
router
    .route("/")
    .post(authAdminProtect_js_1.authAdminProtect, paymentControllers_js_1.createPayment)
    .get(authAdminProtect_js_1.authAdminProtect, paymentControllers_js_1.getPayments);
router
    .route("/:id")
    .put(authAdminProtect_js_1.authAdminProtect, paymentControllers_js_1.updatePayment)
    .delete(authAdminProtect_js_1.authAdminProtect, paymentControllers_js_1.deletePayment);
exports.default = router;
