"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var bankControllers_js_1 = require("../controllers/bankControllers.js");
var router = (0, express_1.Router)();
var authAdminProtect_js_1 = require("../middlewares/adminMiddlewares/authAdminProtect.js");
router
    .route("/")
    .post(authAdminProtect_js_1.authAdminProtect, bankControllers_js_1.createBank)
    .get(authAdminProtect_js_1.authAdminProtect, bankControllers_js_1.getBanks);
router
    .route("/:id")
    .put(authAdminProtect_js_1.authAdminProtect, bankControllers_js_1.updateBank)
    .delete(authAdminProtect_js_1.authAdminProtect, bankControllers_js_1.deleteBank);
exports.default = router;
