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
import ownerRoutes from "./routes/ownerRoutes.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();
const isVercel = process.env.VERCEL;

// ✅ Only create uploads dir locally (Vercel fs is read-only)
if (!isVercel) {
  const uploadsDir = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const reportsDir = path.join(uploadsDir, "reports");
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
}

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploads — local only
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ✅ distPath now correctly points to frontend/dist
const distPath = path.join(__dirname, "../frontend/dist");

// ✅ Serve Vite React build
app.use(express.static(distPath));

// API Routes
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/vendor", vendorRouter);
app.use("/api/cart", cartRouter);
app.use("/api/owner", ownerRoutes);
app.use("/api", productRoutes);

// ✅ Catch-all: serve React app for any non-API route
app.get("*", (req, res) => {
  const indexPath = path.join(distPath, "index.html");

  if (!fs.existsSync(indexPath)) {
    return res.status(404).json({
      success: false,
      message: "Frontend not built. Run `vite build` first.",
    });
  }

  res.sendFile(indexPath);
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Server Error",
  });
});

// Only listen locally — Vercel handles this in production
if (!isVercel) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;