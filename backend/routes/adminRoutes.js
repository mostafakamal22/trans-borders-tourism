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
const {
  comparePassword,
} = require("../middlewares/adminMiddlewares/comparePasswords");

router.route("/").post(validatePassword, createAdmin);

router.route("/login").post(adminLogin);

router
  .route("/:id")
  .get(authAdminProtect, getOneAdmin)
  .put(
    authAdminProtect,
    comparePassword,
    validatePassword,
    checkPassword,
    updateAdmin
  );

module.exports = router;
