const express = require("express");
const {
  createVisa,
  deleteVisa,
  getVisas,
} = require("../controllers/visaControllers");

const router = express.Router();

const {
  authAdminProtect,
} = require("../middlewares/adminMiddlewares/authAdminProtect");

router
  .route("/")
  .post(authAdminProtect, createVisa)
  .get(authAdminProtect, getVisas);

router.route("/:id").delete(authAdminProtect, deleteVisa);

module.exports = router;
