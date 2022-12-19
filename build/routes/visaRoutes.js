"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var visaControllers_1 = require("../controllers/visaControllers");
var authAdminProtect_1 = require("../middlewares/adminMiddlewares/authAdminProtect");
var router = (0, express_1.Router)();
router
    .route("/")
    .post(authAdminProtect_1.authAdminProtect, visaControllers_1.createVisa)
    .get(authAdminProtect_1.authAdminProtect, visaControllers_1.getVisas);
router
    .route("/:id")
    .put(authAdminProtect_1.authAdminProtect, visaControllers_1.updateVisa)
    .delete(authAdminProtect_1.authAdminProtect, visaControllers_1.deleteVisa);
exports.default = router;
