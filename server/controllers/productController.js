import Product from "../models/Product.js";

export const getAllProducts = async (req, res) => {
  try {

    const products = await Product.find({ available: true });

    res.json({
      success: true,
      products
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};