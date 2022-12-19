import { Router } from "express";
import {
  createPurchase,
  getPurchases,
  updatePurchase,
  deletePurchase,
} from "../controllers/purchaseController";
import { authAdminProtect } from "../middlewares/adminMiddlewares/authAdminProtect";

const router = Router();

router
  .route("/")
  .post(authAdminProtect, createPurchase)
  .get(authAdminProtect, getPurchases);

router
  .route("/:id")
  .put(authAdminProtect, updatePurchase)
  .delete(authAdminProtect, deletePurchase);

export default router;
