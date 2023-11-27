import { Router } from "express";
import outlet from "./outlet.js";
import user from "./api/user.js";
import visit from "./visit.js"
const router = Router();
router.use("/outlet", outlet);
router.use("/user", user);
router.use("/visit", visit);
export default router;
