const express = require("express");
const {
  createPurchase,
  getPurchases,
  updatePurchase,
  deletePurchase,
} = require("../controllers/purchaseController");

const router = express.Router();

const {
  authAdminProtect,
} = require("../middlewares/adminMiddlewares/authAdminProtect");

router
  .route("/")
  .post(authAdminProtect, createPurchase)
  .get(authAdminProtect, getPurchases);

router
  .route("/:id")
  .put(authAdminProtect, updatePurchase)
  .delete(authAdminProtect, deletePurchase);

module.exports = router;
