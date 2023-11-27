import { Router } from "express";
import { getVisit } from "../controllers/dms/index.js";
// import { auth } from "../middlewares/index.js";

const router = Router();

router.get("/", getVisit);

export default router;
