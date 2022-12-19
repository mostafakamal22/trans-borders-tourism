"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var adminControllers_js_1 = require("../controllers/adminControllers.js");
var validatePassword_js_1 = require("../middlewares/adminMiddlewares/validatePassword.js");
var authAdminProtect_js_1 = require("../middlewares/adminMiddlewares/authAdminProtect.js");
var checkPassword_js_1 = require("../middlewares/adminMiddlewares/checkPassword.js");
var comparePasswords_js_1 = require("../middlewares/adminMiddlewares/comparePasswords.js");
var router = (0, express_1.Router)();
router.route("/").post(authAdminProtect_js_1.authAdminProtect, validatePassword_js_1.validatePassword, adminControllers_js_1.createAdmin);
router.route("/login").post(adminControllers_js_1.adminLogin);
router
    .route("/:id")
    .get(authAdminProtect_js_1.authAdminProtect, adminControllers_js_1.getOneAdmin)
    .put(authAdminProtect_js_1.authAdminProtect, comparePasswords_js_1.comparePassword, validatePassword_js_1.validatePassword, checkPassword_js_1.checkPassword, adminControllers_js_1.updateAdmin);
exports.default = router;
