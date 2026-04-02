// routes/adminRoutes.js
import express from "express";
import { protect } from "../middleware/auth.js";
import {
  changeRoleToAdmin,
  changeRoleToVendor,
  getDashboardData,
  getAllUsers,
  deleteUser,
  getDisputes,
  resolveDispute,
  getServiceAreas,
  addServiceArea,
  updateServiceArea,
  getAllRentals,
  getAllOrders,
  getAllProducts,
  deleteServiceArea,
 
} from "../controllers/adminController.js";

const router = express.Router();

// ----------------- Role Management -----------------
router.post("/make-admin", protect, changeRoleToAdmin);
router.post("/make-vendor", protect, changeRoleToVendor);

// ----------------- Dashboard -----------------
router.get("/dashboard", protect, getDashboardData);

// ----------------- Orders & Products -----------------
router.get("/orders", protect, getAllOrders);
router.get("/products", protect, getAllProducts);

// ----------------- Users -----------------
router.get("/users", protect, getAllUsers);
router.post("/delete-user", protect, deleteUser);

// ----------------- Disputes -----------------
router.get("/disputes", protect, getDisputes);
router.post("/resolve-dispute", protect, resolveDispute);

// ----------------- Service Areas -----------------
router.get("/service-areas", protect, getServiceAreas);
router.post("/add-service-area", protect, addServiceArea);
router.post("/update-service-area", protect, updateServiceArea);
router.delete("/service-area/:areaId", protect, deleteServiceArea);

// ----------------- Admin Monitor / Rentals -----------------
router.get("/rentals", protect, getAllRentals);


export default router;