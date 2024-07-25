import { Router } from "express";
// import { specs, swaggerConfig } from '../../config/index.js';
import salesOrder from "./salesOrder.js";
import outlet from "./outlet.js";
const router = Router();
router.use("/sales-order", salesOrder);
router.use("/outlet", outlet);
export default router;
