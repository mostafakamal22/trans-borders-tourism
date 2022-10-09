const express = require("express");

const router = express.Router();

const {
  getOneAdmin,
  createAdmin,
  adminLogin,
} = require("../controllers/adminControllers");

const {
  validatePassword,
} = require("../middlewares/adminMiddlewares/validatePassword");
const {
  checkPassword,
} = require("../middlewares/adminMiddlewares/checkPassword");
const { checkRole } = require("../middlewares/adminMiddlewares/checkRole");
const {
  authAdminProtect,
} = require("../middlewares/adminMiddlewares/authAdminProtect");

router.route("/").post(validatePassword, createAdmin);

router.route("/login").post(adminLogin);

router.route("/:id").get(authAdminProtect, getOneAdmin);

module.exports = router;
