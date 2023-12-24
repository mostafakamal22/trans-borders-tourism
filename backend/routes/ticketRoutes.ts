import { Router } from "express";
import {
  deleteTicket,
  updateTicket,
  getTickets,
  createTicket,
  getTicketsStatistics,
  getOneTicket,
} from "../controllers/ticketControllers";
import { authAdminProtect } from "../middlewares/adminMiddlewares/authAdminProtect";

const router = Router();

router.route("/").post(authAdminProtect, createTicket);

router.route("/statistics").get(authAdminProtect, getTicketsStatistics);

router.route("/query").post(authAdminProtect, getTickets);

router
  .route("/:id")
  .get(authAdminProtect, getOneTicket)
  .put(authAdminProtect, updateTicket)
  .delete(authAdminProtect, deleteTicket);

export default router;
