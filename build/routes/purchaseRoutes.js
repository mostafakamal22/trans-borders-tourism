"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var purchaseController_1 = require("../controllers/purchaseController");
var authAdminProtect_1 = require("../middlewares/adminMiddlewares/authAdminProtect");
var router = (0, express_1.Router)();
router.route("/").post(authAdminProtect_1.authAdminProtect, purchaseController_1.createPurchase);
router.route("/query").post(authAdminProtect_1.authAdminProtect, purchaseController_1.getPurchases);
router
    .route("/:id")
    .get(authAdminProtect_1.authAdminProtect, purchaseController_1.getOnePurchase)
    .put(authAdminProtect_1.authAdminProtect, purchaseController_1.updatePurchase)
    .delete(authAdminProtect_1.authAdminProtect, purchaseController_1.deletePurchase);
exports.default = router;
