"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authAdminProtect_1 = require("../middlewares/adminMiddlewares/authAdminProtect");
var billControllers_1 = require("../controllers/billControllers");
var router = (0, express_1.Router)();
router.route("/").post(authAdminProtect_1.authAdminProtect, billControllers_1.createBill);
router.route("/query").post(authAdminProtect_1.authAdminProtect, billControllers_1.getBills);
router.route("/statistics").get(authAdminProtect_1.authAdminProtect, billControllers_1.getBillsStatistics);
router
    .route("/:id")
    .get(authAdminProtect_1.authAdminProtect, billControllers_1.getOneBill)
    .put(authAdminProtect_1.authAdminProtect, billControllers_1.updateBill)
    .delete(authAdminProtect_1.authAdminProtect, billControllers_1.deleteBill);
exports.default = router;
