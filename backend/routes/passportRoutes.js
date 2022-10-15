const express = require("express");

const router = express.Router();

const {
  authAdminProtect,
} = require("../middlewares/adminMiddlewares/authAdminProtect");

const {
  getPassports,
  deletePassport,
  updatePassport,
  createPassport,
} = require("../controllers/passportControllers");

router
  .route("/")
  .post(authAdminProtect, createPassport)
  .get(authAdminProtect, getPassports);

router
  .route("/:id")
  .put(authAdminProtect, updatePassport)
  .delete(authAdminProtect, deletePassport);

module.exports = router;
