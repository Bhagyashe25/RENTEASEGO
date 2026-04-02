// routes/ownerRoutes.js
import express from "express";
import { changeRoleToVendor } from "../controllers/adminController.js"; // using your existing controller
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Logged-in users can become vendors
router.post("/change-role", protect, changeRoleToVendor);

export default router;