import { Router } from "express";
import {
  createPurchase,
  getPurchases,
  updatePurchase,
  deletePurchase,
  getOnePurchase,
} from "../controllers/purchaseController";
import { authAdminProtect } from "../middlewares/adminMiddlewares/authAdminProtect";

const router = Router();

router.route("/").post(authAdminProtect, createPurchase);

router.route("/query").post(authAdminProtect, getPurchases);

router
  .route("/:id")
  .get(authAdminProtect, getOnePurchase)
  .put(authAdminProtect, updatePurchase)
  .delete(authAdminProtect, deletePurchase);

export default router;
