import Product from "../models/Product.js";
import Cart from "../models/cart.js";
import User from "../models/User.js";
import Maintenance from "../models/Maintenance.js";
import imagekit from "../configs/imagekit.js";

// ✅ Helper to upload to ImageKit
const uploadToImageKit = async (file) => {
  const response = await imagekit.upload({
    file: file.buffer,
    fileName: Date.now() + "-" + file.originalname,
    folder: "/renteasego",
  });
  return response.url;
};

export const updateVendorImage = async (req, res) => {
  try {
    if (!req.user || !req.user.id)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!req.file)
      return res.status(400).json({ success: false, message: "No file uploaded" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // ✅ Upload to ImageKit
    const imageUrl = await uploadToImageKit(req.file);
    user.image = imageUrl;
    await user.save();

    res.json({ success: true, message: "Profile image updated", newImageUrl: imageUrl });
  } catch (err) {
    console.error("Update Image Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    let locations = [];
    let tenureOptions = [];

    try {
      locations = JSON.parse(req.body.locations || "[]");
      tenureOptions = JSON.parse(req.body.tenureOptions || "[]");
    } catch (e) {
      console.log("JSON Parse Error:", e.message);
    }

    const {
      name,
      description,
      category,
      pricePerDay,
      pricePerWeek,
      pricePerMonth,
      securityDeposit,
      orderType,
    } = req.body;

    const location =
      Array.isArray(locations) && locations.length > 0
        ? locations.join(", ")
        : req.body.location || "";

    if (!name || !description || !category || !pricePerMonth || !req.file || !location || !orderType) {
      return res.status(400).json({
        success: false,
        message: "All required fields and image are mandatory",
        missing: {
          name: !name,
          description: !description,
          category: !category,
          pricePerMonth: !pricePerMonth,
          location: !location,
          orderType: !orderType,
          image: !req.file,
          locationsArray: locations.length === 0,
        },
      });
    }

    // ✅ Upload to ImageKit
    const imageUrl = await uploadToImageKit(req.file);

    const product = new Product({
      name,
      description,
      category,
      pricePerDay: Number(pricePerDay || 0),
      pricePerWeek: Number(pricePerWeek || 0),
      pricePerMonth: Number(pricePerMonth),
      securityDeposit: Number(securityDeposit || 0),
      tenureOptions,
      location: locations,
      orderType,
      image: imageUrl, // ✅ ImageKit URL
      admin: req.user._id,
      vendor: req.user._id,
    });

    await product.save();
    console.log("✅ Product saved:", product._id);

    res.json({ success: true, message: "Product added successfully", product });
  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ admin: req.user._id });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId, name, description, pricePerDay } = req.body;
    const product = await Product.findByIdAndUpdate(
      productId,
      { name, description, pricePerDay },
      { new: true }
    );
    res.json({ success: true, message: "Product updated", product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    await Product.findByIdAndDelete(productId);
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleProductAvailability = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    product.available = !product.available;
    await product.save();

    res.json({ success: true, message: "Product availability toggled", product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;
    const booking = await Cart.findByIdAndUpdate(bookingId, { status }, { new: true });
    res.json({ success: true, message: "Booking status updated", booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVendorMaintenance = async (req, res) => {
  try {
    if (req.user.role !== "vendor") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const vendorProducts = await Product.find({ admin: req.user._id });
    if (vendorProducts.length === 0) {
      return res.json({ success: true, maintenance: [], returns: [] });
    }

    const productIds = vendorProducts.map((p) => p._id);
    const vendorCarts = await Cart.find({ product: { $in: productIds } }).populate("product", "name");
    const cartIds = vendorCarts.map((c) => c._id);

    const maintenanceRequests = await Maintenance.find({
      productId: { $in: cartIds },
    }).populate("userId", "name email");

    const maintenanceList = maintenanceRequests.map((m) => {
      const cart = vendorCarts.find((c) => c._id.toString() === m.productId.toString());
      const productName = cart?.product?.name || `Cart ${m.productId?.slice(-4)}`;
      return {
        _id: m._id,
        productName,
        status: m.status || "pending",
        issue: m.issue,
        description: m.description,
        userName: m.userId?.name || "Unknown",
        createdAt: m.createdAt,
      };
    });

    const returnsList = await Cart.find({
      product: { $in: productIds },
      status: { $in: ["returned", "pending return"] },
    }).populate("product", "name").populate("user", "name");

    res.json({
      success: true,
      maintenance: maintenanceList,
      returns: returnsList.map((r) => ({
        _id: r._id,
        productName: r.product?.name || "Unknown",
        status: r.status,
        userName: r.user?.name || "Unknown",
        createdAt: r.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVendorLogistics = async (req, res) => {
  try {
    const schedules = await Cart.find({
      admin: req.user._id,
      status: { $in: ["confirmed", "pending"] },
    })
      .populate("product", "name image")
      .populate("user", "name email")
      .sort({ deliveryDate: 1 });

    const formattedSchedules = schedules.map((item) => ({
      _id: item._id,
      type: item.orderType,
      item: item.product?.name || "Unknown Item",
      address: item.location || "No Address",
      date: item.deliveryDate ? item.deliveryDate.toISOString().split("T")[0] : "N/A",
      slot: item.pickupDate ? item.pickupDate.toISOString().split("T")[0] : "N/A",
    }));

    res.json({ success: true, schedules: formattedSchedules });
  } catch (error) {
    console.error("Logistics Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVendorOrders = async (req, res) => {
  try {
    const orders = await Cart.find({ admin: req.user._id })
      .populate("product", "name image category")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMaintenanceStatus = async (req, res) => {
  try {
    const { maintenanceId, status } = req.body;

    if (req.user.role !== "vendor") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const maintenance = await Maintenance.findByIdAndUpdate(
      maintenanceId,
      { status },
      { new: true }
    );

    if (!maintenance) {
      return res.status(404).json({ success: false, message: "Maintenance request not found" });
    }

    res.json({ success: true, message: "Status updated", maintenance });
  } catch (error) {
    console.error("Update Maintenance Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;
    const vendorId = req.user._id;

    const order = await Cart.findOne({ _id: bookingId, vendor: vendorId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found or unauthorized" });
    }

    const validStatuses = ["pending", "confirmed", "cancelled", "delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    order.status = status;
    await order.save();

    res.json({ success: true, message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};