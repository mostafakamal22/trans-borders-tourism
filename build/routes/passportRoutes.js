"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authAdminProtect_js_1 = require("../middlewares/adminMiddlewares/authAdminProtect.js");
var passportControllers_js_1 = require("../controllers/passportControllers.js");
var router = (0, express_1.Router)();
router
    .route("/")
    .post(authAdminProtect_js_1.authAdminProtect, passportControllers_js_1.createPassport)
    .get(authAdminProtect_js_1.authAdminProtect, passportControllers_js_1.getPassports);
router
    .route("/:id")
    .put(authAdminProtect_js_1.authAdminProtect, passportControllers_js_1.updatePassport)
    .delete(authAdminProtect_js_1.authAdminProtect, passportControllers_js_1.deletePassport);
exports.default = router;
