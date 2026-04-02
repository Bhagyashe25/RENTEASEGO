import express from "express";
import "dotenv/config";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import connectDB from "./configs/db.js";

import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import vendorRouter from "./routes/vendorRoutes.js";
import cartRouter from "./routes/cartRoute.js";
import ownerRoutes from "./routes/ownerRoutes.js"
import productRoutes from "./routes/productRoutes.js";


const app = express();


const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const reportsDir = path.join(uploadsDir, "reports");
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test Route
app.get("/", (req, res) => {
  res.send("Rental Platform API Running 🚀");
});

// API Routes
app.use("/api/user", userRouter);       // User auth & profile
app.use("/api/admin", adminRouter);     // Admin-only features
app.use("/api/vendor", vendorRouter);   // Vendor-only features
app.use("/api/cart", cartRouter);       // Cart / Bookings
app.use("/api/owner", ownerRoutes);
app.use("/api", productRoutes);
// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: "Server Error",
  });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});