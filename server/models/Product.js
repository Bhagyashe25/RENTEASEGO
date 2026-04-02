// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { 
      type: String, 
      required: true,
      enum: [
        "Bed", "Sofa", "Table",
        "Fridge", "Washing Machine", "TV"
      ],
      trim: true // ✅ Removed lowercase: true
    },
    location: { 
      type: [String], 
      required: true,
      trim: true 
    },
    pricePerMonth: { type: Number, required: true, min: 0 },
    pricePerDay: { type: Number, default: 0 },
    pricePerWeek: { type: Number, default: 0 },
    securityDeposit: { type: Number, default: 0 },
    tenureOptions: { type: [String], default: [] },
    minRentalDays: { type: Number, default: 1 },
    maxRentalDays: { type: Number, default: 30 },
    orderType: { type: String, enum: ["Delivery", "Pickup"], required: true },
    image: { type: String, default: "" },
    available: { type: Boolean, default: true },
    stock: { type: Number, default: 1 },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);