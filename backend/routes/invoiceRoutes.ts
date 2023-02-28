import { Router } from "express";
import { authAdminProtect } from "../middlewares/adminMiddlewares/authAdminProtect";
import {
  getInvoices,
  createInvoice,
  deleteInvoice,
} from "../controllers/invoiceControllers";

const router = Router();

router.route("/").post(authAdminProtect, createInvoice);

router.route("/query").post(authAdminProtect, getInvoices);

router.route("/:id").delete(authAdminProtect, deleteInvoice);

export default router;
