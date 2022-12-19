"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var ticketControllers_js_1 = require("../controllers/ticketControllers.js");
var authAdminProtect_js_1 = require("../middlewares/adminMiddlewares/authAdminProtect.js");
var router = (0, express_1.Router)();
router
    .route("/")
    .post(authAdminProtect_js_1.authAdminProtect, ticketControllers_js_1.createTicket)
    .get(authAdminProtect_js_1.authAdminProtect, ticketControllers_js_1.getTickets);
router
    .route("/:id")
    .put(authAdminProtect_js_1.authAdminProtect, ticketControllers_js_1.updateTicket)
    .delete(authAdminProtect_js_1.authAdminProtect, ticketControllers_js_1.deleteTicket);
exports.default = router;
