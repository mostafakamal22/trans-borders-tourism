"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var purchaseController_js_1 = require("../controllers/purchaseController.js");
var authAdminProtect_js_1 = require("../middlewares/adminMiddlewares/authAdminProtect.js");
var router = (0, express_1.Router)();
router
    .route("/")
    .post(authAdminProtect_js_1.authAdminProtect, purchaseController_js_1.createPurchase)
    .get(authAdminProtect_js_1.authAdminProtect, purchaseController_js_1.getPurchases);
router
    .route("/:id")
    .put(authAdminProtect_js_1.authAdminProtect, purchaseController_js_1.updatePurchase)
    .delete(authAdminProtect_js_1.authAdminProtect, purchaseController_js_1.deletePurchase);
exports.default = router;
