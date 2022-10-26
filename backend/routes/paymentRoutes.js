const express = require("express");
const {
  getPayments,
  createPayment,
  deletePayment,
  updatePayment,
} = require("../controllers/paymentControllers");

const router = express.Router();

const {
  authAdminProtect,
} = require("../middlewares/adminMiddlewares/authAdminProtect");

router
  .route("/")
  .post(authAdminProtect, createPayment)
  .get(authAdminProtect, getPayments);

router
  .route("/:id")
  .put(authAdminProtect, updatePayment)
  .delete(authAdminProtect, deletePayment);

module.exports = router;
