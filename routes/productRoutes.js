import express from "express";
import Product from "../models/productModels.js";
import upload from "../middlewares/upload.js";
import { createProduct,updateProduct } from "../controllers/productController.js";
import { firebaseAuth,adminAuth } from "../middlewares/firebaseAuth.js";

const router = express.Router();

// GET all products (with filters)
router.get("/", async (req, res) => {
  try {
    const { category, subCategory, subSubCategory, outOfStock } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (subCategory && subCategory !== "all") filter.subcategory = subCategory;
    if (subSubCategory && subSubCategory !== "all") filter.subSubcategory = subSubCategory;
    if (outOfStock === "true") filter.countInStock = { $lte: 0 };

    console.log("Filter applied:", filter);
    const products = await Product.find(filter);
    console.log("Products found:", products.length);
    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// GET by search
router.get("/search", async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};
    const products = await Product.find(keyword);
    res.json(products);
  } catch (error) {
    console.error("❌ Error searching products:", error);
    res.status(500).json({ message: "Failed to search products" });
  }
});

// GET single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("❌ Error retrieving product:", error);
    res.status(500).json({ message: "Error retrieving product" });
  }
});

// DELETE product by ID
router.delete("/:id", firebaseAuth,adminAuth, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
});

// POST new product (merged with /create)
router.post("/", firebaseAuth,adminAuth, upload.single("image"), createProduct);

// UPDATE product by ID
router.put("/:id", firebaseAuth, adminAuth, upload.single("image"),updateProduct);

export default router;