import express from "express";
import { protect } from "../middleware/auth.js";
import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  toggleProductAvailability,
  getVendorOrders,
  updateBookingStatus,
  updateVendorImage,
    getVendorMaintenance,
  updateMaintenanceStatus,
   getVendorLogistics
} from "../controllers/vendorController.js";
import upload from "../middleware/multer.js";
import Maintenance from "../models/Maintenance.js";


const router = express.Router();


// Existing Routes
router.post("/update-image", protect, upload.single("image"), updateVendorImage);
router.post("/add-product", protect, upload.single("image"), addProduct);
router.get("/products", protect, getProducts);
router.post("/update-product", protect, updateProduct);
router.post("/delete-product", protect, deleteProduct);
router.post("/toggle-availability", protect, toggleProductAvailability);
router.get("/orders", protect, getVendorOrders);
router.post("/update-order-status", protect, updateBookingStatus);
router.get("/maintenance", protect, getVendorMaintenance);
router.post("/maintenance/update", protect, updateMaintenanceStatus);
router.get("/logistics", protect, getVendorLogistics);

export default router;