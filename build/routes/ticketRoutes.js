"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var ticketControllers_1 = require("../controllers/ticketControllers");
var authAdminProtect_1 = require("../middlewares/adminMiddlewares/authAdminProtect");
var router = (0, express_1.Router)();
router.route("/").post(authAdminProtect_1.authAdminProtect, ticketControllers_1.createTicket);
router.route("/query").post(authAdminProtect_1.authAdminProtect, ticketControllers_1.getTickets);
router
    .route("/:id")
    .put(authAdminProtect_1.authAdminProtect, ticketControllers_1.updateTicket)
    .delete(authAdminProtect_1.authAdminProtect, ticketControllers_1.deleteTicket);
exports.default = router;
