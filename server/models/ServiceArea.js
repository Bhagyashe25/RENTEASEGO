// models/ServiceArea.js
import mongoose from "mongoose";

const ServiceAreaSchema = new mongoose.Schema(
  {
    area: {
      type: String,
      required: [true, "Area name is required"],
      unique: true,
      trim: true,
      maxlength: [100, "Area name cannot exceed 100 characters"],
    },
  },
  { timestamps: true }
);

const ServiceArea = mongoose.model("ServiceArea", ServiceAreaSchema);
export default ServiceArea;