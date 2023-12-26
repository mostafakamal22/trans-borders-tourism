"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authAdminProtect_1 = require("../middlewares/adminMiddlewares/authAdminProtect");
var passportControllers_1 = require("../controllers/passportControllers");
var router = (0, express_1.Router)();
router.route("/").post(authAdminProtect_1.authAdminProtect, passportControllers_1.createPassport);
router.route("/statistics").get(authAdminProtect_1.authAdminProtect, passportControllers_1.getPassportsStatistics);
router.route("/query").post(authAdminProtect_1.authAdminProtect, passportControllers_1.getPassports);
router
    .route("/:id")
    .put(authAdminProtect_1.authAdminProtect, passportControllers_1.updatePassport)
    .get(authAdminProtect_1.authAdminProtect, passportControllers_1.getOnePassport)
    .delete(authAdminProtect_1.authAdminProtect, passportControllers_1.deletePassport);
exports.default = router;
