"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authAdminProtect_1 = require("../middlewares/adminMiddlewares/authAdminProtect");
var invoiceControllers_1 = require("../controllers/invoiceControllers");
var router = (0, express_1.Router)();
router
    .route("/")
    .post(authAdminProtect_1.authAdminProtect, invoiceControllers_1.createInvoice)
    .get(authAdminProtect_1.authAdminProtect, invoiceControllers_1.getInvoices);
router.route("/:id").delete(authAdminProtect_1.authAdminProtect, invoiceControllers_1.deleteInvoice);
exports.default = router;
