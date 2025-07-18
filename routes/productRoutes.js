import express from "express";
import Product from "../models/productSchema.js";

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// ✅ GET single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
console.log("Requested Product ID:", req.params.id);


  } catch (error) {
    console.error("❌ Error retrieving product:", error);
    res.status(500).json({ message: "Error retrieving product" });
  }
});

export default router;
