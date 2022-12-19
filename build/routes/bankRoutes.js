"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var bankControllers_1 = require("../controllers/bankControllers");
var router = (0, express_1.Router)();
var authAdminProtect_1 = require("../middlewares/adminMiddlewares/authAdminProtect");
router
    .route("/")
    .post(authAdminProtect_1.authAdminProtect, bankControllers_1.createBank)
    .get(authAdminProtect_1.authAdminProtect, bankControllers_1.getBanks);
router
    .route("/:id")
    .put(authAdminProtect_1.authAdminProtect, bankControllers_1.updateBank)
    .delete(authAdminProtect_1.authAdminProtect, bankControllers_1.deleteBank);
exports.default = router;
