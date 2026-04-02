import express from "express";
import "dotenv/config";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";


import connectDB from "./configs/db.js";

import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import vendorRouter from "./routes/vendorRoutes.js";
import cartRouter from "./routes/cartRoute.js";
import ownerRoutes from "./routes/ownerRoutes.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ⚠️ Handle file system safely (Vercel-safe)
const uploadsDir = path.join(__dirname, "uploads");

try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const reportsDir = path.join(uploadsDir, "reports");

  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
} catch (err) {
  console.log("⚠️ File system not writable (expected on Vercel)");
}

// Serve static files (may not persist on Vercel)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Connect DB safely
(async () => {
  try {
    await connectDB();
    console.log("✅ DB Connected");
  } catch (err) {
    console.log("❌ DB Connection Failed:", err.message);
  }
})();

// Test Route
app.get("/", (req, res) => {
  res.send("Rental Platform API Running 🚀");
});

// API Routes
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/vendor", vendorRouter);
app.use("/api/cart", cartRouter);
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


export default app;