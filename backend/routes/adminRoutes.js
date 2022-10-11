const express = require("express");

const router = express.Router();

const {
  updateAdmin,
  createAdmin,
  adminLogin,
  getOneAdmin,
} = require("../controllers/adminControllers");

const {
  validatePassword,
} = require("../middlewares/adminMiddlewares/validatePassword");
const {
  authAdminProtect,
} = require("../middlewares/adminMiddlewares/authAdminProtect");
const {
  checkPassword,
} = require("../middlewares/adminMiddlewares/checkPassword");

router.route("/").post(validatePassword, createAdmin);

router.route("/login").post(adminLogin);

router
  .route("/:id")
  .get(authAdminProtect, getOneAdmin)
  .put(authAdminProtect, validatePassword, checkPassword, updateAdmin);

module.exports = router;
