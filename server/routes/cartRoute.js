import express from "express"
import { protect } from "../middleware/auth.js"

import {
  createBooking,
  getUserCart,
  checkoutCart,
  getVendorOrders,
  updateBookingStatus,
  removeFromCart,
} from "../controllers/cartController.js"

const router = express.Router()

router.post("/create", protect, createBooking)

router.get("/my-cart", protect, getUserCart)

router.post("/checkout", protect, checkoutCart)
router.post("/remove", protect, removeFromCart); 

router.get("/vendor-orders", protect, getVendorOrders)

router.post("/update-status", protect, updateBookingStatus)

export default router