import { Router } from "express";
import {
  deleteTicket,
  updateTicket,
  getTickets,
  createTicket,
} from "../controllers/ticketControllers";
import { authAdminProtect } from "../middlewares/adminMiddlewares/authAdminProtect";

const router = Router();

router
  .route("/")
  .post(authAdminProtect, createTicket)
  .get(authAdminProtect, getTickets);

router
  .route("/:id")
  .put(authAdminProtect, updateTicket)
  .delete(authAdminProtect, deleteTicket);

export default router;
