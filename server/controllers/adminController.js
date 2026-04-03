// controllers/adminController.js
import User from "../models/User.js";
import Product from "../models/Product.js";
import Cart from "../models/cart.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import ServiceArea from '../models/ServiceArea.js'

// ----------------- Role Management -----------------
export const changeRoleToAdmin = async (req, res) => {
  try {
    const { userId } = req.body; // Admin sends the ID of the user to promote
    const adminId = req.user._id; // The person making the request

    // Ensure only admins can do this
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Only admins can change roles" });
    }

    await User.findByIdAndUpdate(userId, { role: "admin" });
    res.status(200).json({ success: true, message: "User promoted to Admin" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const changeRoleToVendor = async (req, res) => {
  try {
     const { userId } = req.body;
    await User.findByIdAndUpdate(req.user._id, { role: "vendor" });
    res.status(200).json({ success: true, message: "You are now a Vendor" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;
    if (role !== "admin") return res.status(403).json({ success: false, message: "Unauthorized" });

    // Get total users (excluding admin)
    const totalUsers = await User.countDocuments({ role: { $ne: "admin" } });
    
    // Get total vendors
    const totalVendors = await User.countDocuments({ role: "vendor" });
    
    // Get all products
    const products = await Product.find();
    
    // Get all carts
    const carts = await Cart.find()
      .populate("product")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const pendingCart = carts.filter(cart => cart.status === "pending");
    const completedCart = carts.filter(cart => cart.status === "confirmed");
    const monthlyRevenue = completedCart.reduce((acc, cart) => acc + cart.price, 0);

    // ✅ Return data with 'dashboard' key (matches frontend expectation)
    res.json({
      success: true,
      dashboard: {
        totalProducts: products.length,
        totalCart: carts.length,
        totalUsers,
        totalVendors,
        pendingCart: pendingCart.length,
        completedCart: completedCart.length,
        monthlyRevenue,
        recentCart: carts.slice(0, 3),
      }
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------- User Management -----------------
export const getAllUsers = async (req, res) => {
  try {
    // ✅ Verify user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // ✅ Get ALL users from database
    const users = await User.find().select("-password");
    res.json({ success: true, users });
  } catch (error) {
    console.error("Get All Users Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    await User.findByIdAndDelete(userId);
    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------- Disputes -----------------
export const getDisputes = async (req, res) => {
  try {
    // Placeholder for disputes
    res.json({ success: true, disputes: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resolveDispute = async (req, res) => {
  try {
    res.json({ success: true, message: "Dispute resolved" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------- Service Areas -----------------
export const getServiceAreas = async (req, res) => {
  try {
    const areas = await ServiceArea.find().select("-__v");
    res.json({ success: true, areas });
  } catch (error) {
    console.error("Get Service Areas Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addServiceArea = async (req, res) => {
  try {
    const { area } = req.body;
      // ✅ Validate area is provided
    if (!area || !area.trim()) {
      return res.status(400).json({
        success: false,
        message: "Area name is required",
      });
    }
    const newArea = await ServiceArea.create({ area });
    res.json({ success: true, area: newArea });
  } catch (error) {
    console.error("Add Service Area Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateServiceArea = async (req, res) => {
  try {
    const { areaId, area } = req.body;
    const updatedArea = await ServiceArea.findByIdAndUpdate(areaId, { area }, { new: true });
    res.json({ success: true, area: updatedArea });
  } catch (error) {
    console.error("Update Service Area Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
export const deleteServiceArea = async (req, res) => {
  try {
    const { areaId } = req.params;

    const deletedArea = await ServiceArea.findByIdAndDelete(areaId);

    if (!deletedArea) {
      return res.status(404).json({
        success: false,
        message: "Service area not found",
      });
    }

    res.json({ success: true, message: "Service area deleted successfully" });
  } catch (error) {
    console.error("Delete Service Area Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------- Admin Monitor / Rentals -----------------
export const getAllRentals = async (req, res) => {
  try {
    const rentals = await Cart.find().populate("product").populate("user", "name email");
    res.json({ success: true, rentals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ✅ FIX: Add export keyword
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Cart.find()
      .populate("product")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("vendor", "name email");
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
