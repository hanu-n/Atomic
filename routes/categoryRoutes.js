import express from "express";
import Category from "../models/Category.js";
import categories from "../data/catagory.js";

const router = express.Router();

// Get all categories with their subcategories
router.get("/", async (req, res) => {
  try {
    console.log("🔍 Fetching categories...");
    const categories = await Category.find({}); 
    console.log(`✅ Found ${categories.length} categories:`, categories.map(c => c.name));
    res.json(categories);
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ Get single category by slug
router.get("/:slug", async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error fetching category", error });
  }
});

export default router;