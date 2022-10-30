const express = require("express");
const {
  deleteTicket,
  updateTicket,
  getTickets,
  createTicket,
} = require("../controllers/ticketControllers");

const router = express.Router();

const {
  authAdminProtect,
} = require("../middlewares/adminMiddlewares/authAdminProtect");

router
  .route("/")
  .post(authAdminProtect, createTicket)
  .get(authAdminProtect, getTickets);

router
  .route("/:id")
  .put(authAdminProtect, updateTicket)
  .delete(authAdminProtect, deleteTicket);

module.exports = router;
