// controllers/vendorController.js
import Product from "../models/Product.js";
import Cart from "../models/cart.js";
import User from "../models/User.js"; // make sure path is correct
import Maintenance from "../models/Maintenance.js";

export const updateVendorImage = async (req, res) => {
  try {
    if (!req.user || !req.user.id)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!req.file)
      return res.status(400).json({ success: false, message: "No file uploaded" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Build full URL for frontend
    const fullUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    user.image = fullUrl;
    await user.save();

    res.json({ success: true, message: "Profile image updated", newImageUrl: fullUrl });
  } catch (err) {
    console.error("Update Image Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// ----------------- Product Management -----------------
// controllers/vendorController.js
export const addProduct = async (req, res) => {
  try {
    console.log("=== Add Product Request ===");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    console.log("req.user:", req.user);

    // ✅ Parse JSON arrays FIRST
    let locations = [];
    let tenureOptions = [];
    
    try {
      locations = JSON.parse(req.body.locations || '[]');
      tenureOptions = JSON.parse(req.body.tenureOptions || '[]');
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
      orderType 
    } = req.body;

    // ✅ Frontend sends 'locations' array, backend expects 'location' string
    const location = Array.isArray(locations) && locations.length > 0 
      ? locations.join(', ')  // Convert array to comma-separated string
      : req.body.location || '';

    console.log("Parsed values:", { name, category, location, orderType, locationsArray: locations  });

    // ✅ Updated validation - check parsed values
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
          locationsArray: locations.length === 0
        }
      });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const product = new Product({
      name,
      description,
      category,
      pricePerDay: Number(pricePerDay || 0),
      pricePerWeek: Number(pricePerWeek || 0),
      pricePerMonth: Number(pricePerMonth),
      securityDeposit: Number(securityDeposit || 0),
      tenureOptions, // ✅ Already parsed array
      location: locations,    // ✅ String for schema
      orderType,
      image: imageUrl,
      admin: req.user._id,  // ✅ Keep as admin for backward compatibility
      vendor: req.user._id  // ✅ Add vendor field too
    });

    await product.save();
    console.log("✅ Product saved successfully:", product._id);
    
    res.json({ 
      success: true, 
      message: "Product added successfully", 
      product 
    });
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
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    product.available = !product.available;
    await product.save();

    res.json({ success: true, message: "Product availability toggled", product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------- Vendor Orders -----------------

export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;
    const booking = await Cart.findByIdAndUpdate(bookingId, { status }, { new: true });
    res.json({ success: true, message: "Booking status updated", booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Get Vendor's Maintenance Requests
export const getVendorMaintenance = async (req, res) => {
  try {
    
    if (req.user.role !== "vendor") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // 1. Get vendor's products ONLY
    const vendorProducts = await Product.find({ admin: req.user._id });
    console.log("🔍 Vendor products found:", vendorProducts.length);
    
    if (vendorProducts.length === 0) {
      return res.json({ 
        success: true, 
        maintenance: [], 
        returns: [],
        debug: { message: "No products found for this vendor" }
      });
    }

    const productIds = vendorProducts.map(p => p._id);

    // 2. Get carts for THESE products
    const vendorCarts = await Cart.find({ 
      product: { $in: productIds } 
    }).populate('product', 'name');
    


    const cartIds = vendorCarts.map(c => c._id);

    // 3. Get maintenance for THESE carts
    const maintenanceRequests = await Maintenance.find({ 
      productId: { $in: cartIds } 
    }).populate('userId', 'name email');

    // 4. Map with CORRECT product names
    const maintenanceList = maintenanceRequests.map(m => {
      const cart = vendorCarts.find(c => c._id.toString() === m.productId.toString());
      const productName = cart?.product?.name || `Cart ${m.productId?.slice(-4)}`;
      
      return {
        _id: m._id,
        productName,
        status: m.status || 'pending',
        issue: m.issue,
        description: m.description,
        userName: m.userId?.name || 'Unknown',
        createdAt: m.createdAt
      };
    });

    // 5. Returns
    const returnsList = await Cart.find({
      product: { $in: productIds },
      status: { $in: ["returned", "pending return"] }
    }).populate('product', 'name').populate('user', 'name');

    res.json({ 
      success: true, 
      maintenance: maintenanceList, 
      returns: returnsList.map(r => ({
        _id: r._id,
        productName: r.product?.name || 'Unknown',
        status: r.status,
        userName: r.user?.name || 'Unknown',
        createdAt: r.createdAt
      })),
     
    });

  } catch (error) {
    
    res.status(500).json({ success: false, message: error.message });
  }
};
// Logistics route



export const getVendorLogistics = async (req, res) => {
  try {
    // Find carts belonging to this vendor (admin field)
    const schedules = await Cart.find({
      admin: req.user._id,
      status: { $in: ["confirmed", "pending"] }
    })
      .populate("product", "name image")
      .populate("user", "name email")
      .sort({ deliveryDate: 1 });

   const formattedSchedules = schedules.map(item => ({
  _id: item._id,
  type: item.orderType, // ✅ clean distinction
  item: item.product?.name || "Unknown Item",
  address: item.location || "No Address",
  date: item.deliveryDate ? item.deliveryDate.toISOString().split("T")[0] : "N/A",
  slot: item.pickupDate ? item.pickupDate.toISOString().split("T")[0] : "N/A"
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

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Update Maintenance Request Status
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

    // ✅ Find the order
    const order = await Cart.findOne({ _id: bookingId, vendor: vendorId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or unauthorized",
      });
    }
    // ✅ Allow all status transitions
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    // ✅ Update status
    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};