const express = require("express");
const {
  createBank,
  getBanks,
  updateBank,
  deleteBank,
} = require("../controllers/bankControllers");

const router = express.Router();

const {
  authAdminProtect,
} = require("../middlewares/adminMiddlewares/authAdminProtect");

router
  .route("/")
  .post(authAdminProtect, createBank)
  .get(authAdminProtect, getBanks);

router
  .route("/:id")
  .put(authAdminProtect, updateBank)
  .delete(authAdminProtect, deleteBank);

module.exports = router;
