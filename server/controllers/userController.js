import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Cart from '../models/cart.js'
import Maintenance from "../models/Maintenance.js"

// generate JWT TOKEN
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, 
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )
}

// Register User
export const registerUser = async (req, res) => {
  try {

    const { name, email, password } = req.body

    if (!name || !email || !password || password.length < 8) {
      return res.json({ success: false, message: "Fill all fields properly" })
    }

    const userExists = await User.findOne({ email })

    if (userExists) {
      return res.json({ success: false, message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role:"user"
    })

    const token = generateToken(user._id)

    res.json({ success: true, token })

  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}

// Login User
export const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.json({ success: false, message: "User not found" })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" })
    }

    const token = generateToken(user._id)

      res.json({ 
      success: true, 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role // <--- IMPORTANT
      } 
    })

  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }

}

// Get user data
export const getUserData = async (req, res) => {

  try {

    const user = req.user

    res.json({ success: true, user })

  } catch (error) {

    console.log(error.message)
    res.json({ success: false, message: error.message })

  }

}
// ✅ NEW: Submit Maintenance Request
export const submitMaintenanceRequest = async (req, res) => {
  try {
    const { productId, issue, description, userId } = req.body;

    // ✅ Verify user is authenticated
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // ✅ Verify user owns this product
    const cartItem = await Cart.findOne({
      _id: productId,
      user: req.user._id,
      status: "confirmed"
    });

    if (!cartItem) {
      return res.status(400).json({ success: false, message: "Invalid product or not your rental" });
    }
    // ✅ Create maintenance request
    const maintenance = await Maintenance.create({
      userId: req.user._id,
      productId: productId,
      issue: issue,
      description: description,
      status: "pending",
      priority: "normal"
    });

    res.json({ success: true, message: "Maintenance request submitted", maintenance });
  } catch (error) {
    console.error("Maintenance Request Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ NEW: Get User's Maintenance Requests
export const getMaintenanceRequests = async (req, res) => {
  try {
    const requests = await Maintenance.find({ userId: req.user._id })
      .populate("productId")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    console.error("Get Maintenance Requests Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};