"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authAdminProtect_js_1 = require("../middlewares/adminMiddlewares/authAdminProtect.js");
var invoiceControllers_js_1 = require("../controllers/invoiceControllers.js");
var router = (0, express_1.Router)();
router
    .route("/")
    .post(authAdminProtect_js_1.authAdminProtect, invoiceControllers_js_1.createInvoice)
    .get(authAdminProtect_js_1.authAdminProtect, invoiceControllers_js_1.getInvoices);
router.route("/:id").delete(authAdminProtect_js_1.authAdminProtect, invoiceControllers_js_1.deleteInvoice);
exports.default = router;
