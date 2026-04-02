import Cart from "../models/cart.js";
import Product from "../models/Product.js";


// CHECK PRODUCT AVAILABILITY
const checkAvailability = async (productId, deliveryDate, pickupDate) => {

  const bookings = await Cart.find({
    product: productId,
    deliveryDate: { $lte: pickupDate },
    pickupDate: { $gte: deliveryDate },
    status: { $ne: "cancelled" }
  });

  return bookings.length === 0;
};


// CALCULATE RENTAL PRICE
const calculatePrice = (product, deliveryDate, pickupDate) => {

  const start = new Date(deliveryDate);
  const end = new Date(pickupDate);

  const diffTime = Math.abs(end - start);

  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (days >= 30 && product.pricePerMonth) {
    return product.pricePerMonth * Math.ceil(days / 30);
  }

  if (days >= 7 && product.pricePerWeek) {
    return product.pricePerWeek * Math.ceil(days / 7);
  }

  return product.pricePerDay * days;
};


// CREATE BOOKING / ADD TO CART
export const createBooking = async (req, res) => {

  try {

    const { productId, deliveryDate, pickupDate, location, tenure, orderType } = req.body;

    if (!productId || !deliveryDate || !pickupDate || !location || !tenure ||!orderType) {
      return res.json({
        success: false,
        message: "All fields are required"
      });
    }

    const userId = req.user._id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.json({
        success: false,
        message: "Product not found"
      });
    }

    if (!product.available) {
      return res.json({
        success: false,
        message: "Product currently unavailable"
      });
    }

    const available = await checkAvailability(
      productId,
      deliveryDate,
      pickupDate,
    );

    // if (!available) {
    //   return res.json({
    //     success: false,
    //     message: "Product not available for selected dates"
    //   });
    // }
    const deliveryDateObj = new Date(deliveryDate);
    const pickupDateObj = new Date(pickupDate);

    if (isNaN(deliveryDateObj) || isNaN(pickupDateObj)) {
      return res.json({
        success: false,
        message: "Invalid date format"
      });
    }

    if (pickupDateObj <= deliveryDateObj) {
      return res.json({
        success: false,
        message: "Pickup date must be after delivery date"
      });
    }


    const price = calculatePrice(
      product,
      deliveryDate,
      pickupDate
    );
     if (isNaN(price) || price <= 0) {
      return res.json({
        success: false,
        message: "Invalid price calculation"
      });
    }

    const booking = new Cart({

      product: productId,
      user: userId,
      admin: product.admin,
      tenure, // ✅ Pass tenure
       deliveryDate: deliveryDateObj, // ✅ Convert to Date
      pickupDate: pickupDateObj,
      location,

      price,
      securityDeposit: product.securityDeposit,

      status: "pending",
      orderType,

      deliveryStatus: "pending",
      returnStatus: "not-returned",

      damageReported: false,
      damageFee: 0
    });

    await booking.save();

    res.json({
      success: true,
      message: "Product added to cart",
      booking
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message
    });

  }

};


// USER CART
export const getUserCart = async (req, res) => {

  try {

    const carts = await Cart.find({
      user: req.user._id
    })
      .populate("product")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      carts
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message
    });

  }

};
export const removeFromCart = async (req, res) => {
  try {
    const { cartId } = req.body;

    if (!cartId) {
      return res.status(400).json({
        success: false,
        message: "Cart ID is required"
      });
    }

    // Find and delete cart item for this user
    const deletedItem = await Cart.findOneAndDelete({
      _id: cartId,
      user: req.user._id
    });

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found"
      });
    }

    res.json({
      success: true,
      message: "Item removed from cart"
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// CHECKOUT
export const checkoutCart = async (req, res) => {

  try {

    await Cart.updateMany(
      {
        user: req.user._id,
        status: "pending"
      },
      {
        status: "confirmed"
      }
    );

    res.json({
      success: true,
      message: "Booking confirmed"
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message
    });

  }

};


// VENDOR ORDERS
export const getVendorOrders = async (req, res) => {

  try {

    const orders = await Cart.find({
      admin: req.user._id
    })
      .populate("product")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message
    });

  }

};


// UPDATE BOOKING STATUS
export const updateBookingStatus = async (req, res) => {

  try {

    const { bookingId, status } = req.body;

    const booking = await Cart.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    res.json({
      success: true,
      message: "Status updated",
      booking
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message
    });

  }

};