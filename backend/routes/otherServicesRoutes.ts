import { Router } from "express";
import { authAdminProtect } from "../middlewares/adminMiddlewares/authAdminProtect";
import { getOtherServices } from "../controllers/otherServicesControllers";

const router = Router();

router.route("/query").post(authAdminProtect, getOtherServices);

export default router;
