"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var visaControllers_js_1 = require("../controllers/visaControllers.js");
var authAdminProtect_js_1 = require("../middlewares/adminMiddlewares/authAdminProtect.js");
var router = (0, express_1.Router)();
router
    .route("/")
    .post(authAdminProtect_js_1.authAdminProtect, visaControllers_js_1.createVisa)
    .get(authAdminProtect_js_1.authAdminProtect, visaControllers_js_1.getVisas);
router
    .route("/:id")
    .put(authAdminProtect_js_1.authAdminProtect, visaControllers_js_1.updateVisa)
    .delete(authAdminProtect_js_1.authAdminProtect, visaControllers_js_1.deleteVisa);
exports.default = router;
