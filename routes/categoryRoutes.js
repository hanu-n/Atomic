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

// 🔧 Manual seeding route (for testing)
router.post("/seed", async (req, res) => {
  try {
    console.log("🌱 Seeding categories...");
    
    // Clear existing categories
    await Category.deleteMany({});
    console.log("🗑️ Cleared existing categories");
    
    // Insert new categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Seeded ${createdCategories.length} categories`);
    
    res.json({ 
      message: `Successfully seeded ${createdCategories.length} categories`,
      categories: createdCategories 
    });
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    res.status(500).json({ message: "Error seeding categories", error: error.message });
  }
});

export default router;
