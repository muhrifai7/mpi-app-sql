import { Router } from "express";
import { getSalesOrder } from "../controllers/salesOrder/index.js";
const router = Router();

// AUTH
// EDIT

router.get("/:nomor_surat", getSalesOrder);

export default router;
