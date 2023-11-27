import { Router } from "express";
// import { specs, swaggerConfig } from '../../config/index.js';
import outlet from "./outlet.js";
import user from "./api/user.js";
const router = Router();
router.use("/outlet", outlet);
router.use("/user", user);
export default router;
