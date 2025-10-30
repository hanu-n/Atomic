import express from "express";
import Category from "../models/Category.js";
import categories from "../data/catagory.js";

const router = express.Router();

// ✅ Get all categories
router.get("/", async (req, res) => {
  try {
    console.log("🔍 Fetching categories...");
    const allCategories = await Category.find({});
    console.log(`✅ Found ${allCategories.length} categories`);
    res.json(allCategories);
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    res.status(500).json({ message: "Error fetching categories", error: error.message });
  }
});

// ✅ Get single category by slug
router.get("/:slug", async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    console.error("❌ Error fetching single category:", error);
    res.status(500).json({ message: "Error fetching category", error: error.message });
  }
});

// ✅ Manual seeding route
router.post("/seed", async (req, res) => {
  try {
    console.log("🌱 Seeding categories...");
    await Category.deleteMany({});
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Seeded ${createdCategories.length} categories`);
    res.json({ message: "Categories seeded successfully", categories: createdCategories });
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    res.status(500).json({ message: "Error seeding categories", error: error.message });
  }
});

export default router;
