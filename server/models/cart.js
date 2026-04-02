
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
{
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  tenure: {
    type: String,
    required: true
  },

  deliveryDate: {
    type: Date,
    required: true
  },

  pickupDate: {
    type: Date
  },

  location: {
    type: String,
    required: true
  },
  orderType: {
  type: String,
  enum: ["Delivery", "Pickup"],
  required: true
},

  securityDeposit: {
    type: Number,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  deliveryStatus: {
    type: String,
    enum: ["pending", "dispatched", "delivered"],
    default: "pending"
  },

  returnStatus: {
    type: String,
    enum: ["not-returned", "returned"],
    default: "not-returned"
  },

  damageReported: {
    type: Boolean,
    default: false
  },

  damageFee: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending"
  },
  

},
{ timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;