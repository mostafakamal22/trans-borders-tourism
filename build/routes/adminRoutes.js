"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var adminControllers_1 = require("../controllers/adminControllers");
var validatePassword_1 = require("../middlewares/adminMiddlewares/validatePassword");
var authAdminProtect_1 = require("../middlewares/adminMiddlewares/authAdminProtect");
var checkPassword_1 = require("../middlewares/adminMiddlewares/checkPassword");
var comparePasswords_1 = require("../middlewares/adminMiddlewares/comparePasswords");
var router = (0, express_1.Router)();
router.route("/").post(authAdminProtect_1.authAdminProtect, validatePassword_1.validatePassword, adminControllers_1.createAdmin);
router.route("/login").post(adminControllers_1.adminLogin);
router
    .route("/:id")
    .get(authAdminProtect_1.authAdminProtect, adminControllers_1.getOneAdmin)
    .put(authAdminProtect_1.authAdminProtect, comparePasswords_1.comparePassword, validatePassword_1.validatePassword, checkPassword_1.checkPassword, adminControllers_1.updateAdmin);
exports.default = router;
