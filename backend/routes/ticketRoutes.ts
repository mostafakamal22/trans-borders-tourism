import { Router } from "express";
import {
  deleteTicket,
  updateTicket,
  getTickets,
  createTicket,
} from "../controllers/ticketControllers";
import { authAdminProtect } from "../middlewares/adminMiddlewares/authAdminProtect";

const router = Router();

router.route("/").post(authAdminProtect, createTicket);

router.route("/query").post(authAdminProtect, getTickets);

router
  .route("/:id")
  .put(authAdminProtect, updateTicket)
  .delete(authAdminProtect, deleteTicket);

export default router;
