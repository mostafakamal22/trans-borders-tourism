const express = require("express");

const router = express.Router();

const {
  authAdminProtect,
} = require("../middlewares/adminMiddlewares/authAdminProtect");

const {
  getInvoices,
  getOneInvoice,
  createInvoice,
  deleteInvoice,
} = require("../controllers/invoiceControllers");

router
  .route("/")
  .post(authAdminProtect, createInvoice)
  .get(authAdminProtect, getInvoices);

router
  .route("/:id")
  .get(authAdminProtect, getOneInvoice)
  .delete(authAdminProtect, deleteInvoice);

module.exports = router;
