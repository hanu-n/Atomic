//product routes
import express from "express";
import Product from "../models/productModels.js";
import Category from "../models/Category.js";
import upload from "../middlewares/upload.js";
import { createProduct,updateProduct } from "../controllers/productController.js";
import { firebaseAuth,adminAuth } from "../middlewares/firebaseAuth.js";

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const { category, subCategory, subSubCategory, outOfStock } = req.query;
    let filter = {};

    // 🧹 Normalize helper (remove spaces/dashes and lowercase)
    const normalize = (str) => str?.trim().replace(/[-\s]+/g, " ").toLowerCase();

    let resolvedCategory = category;
    let resolvedSub = subCategory;
    let resolvedSubSub = subSubCategory;

    // ✅ Resolve category/subcategory names via Category model if available
    if (category) {
      const catDoc = await Category.findOne({
        $or: [
          { slug: category },
          { name: new RegExp(`^${category}$`, "i") }
        ],
      });

      if (catDoc) {
        resolvedCategory = catDoc.name;

        if (subCategory && subCategory !== "all") {
          const foundSub = catDoc.subCategories?.find(
            (s) =>
              s.slug === subCategory ||
              new RegExp(`^${subCategory}$`, "i").test(s.name)
          );
          if (foundSub) resolvedSub = foundSub.name;

          if (foundSub && subSubCategory && subSubCategory !== "all") {
            const foundSubSub = foundSub.subCategories?.find(
              (ss) =>
                ss.slug === subSubCategory ||
                new RegExp(`^${subSubCategory}$`, "i").test(ss.name)
            );
            if (foundSubSub) resolvedSubSub = foundSubSub.name;
          }
        }
      }
    }

    // ✅ Build flexible query filters
    if (resolvedCategory)
      filter.category = { $regex: new RegExp(`^${normalize(resolvedCategory)}`, "i") };
    if (resolvedSub && resolvedSub !== "all")
      filter.subcategory = { $regex: new RegExp(`^${normalize(resolvedSub)}`, "i") };
    if (resolvedSubSub && resolvedSubSub !== "all")
      filter.subSubcategory = { $regex: new RegExp(`^${normalize(resolvedSubSub)}`, "i") };

    console.log("🧠 Applied filter:", filter);

    const products = await Product.find(filter);
    console.log(`✅ Found ${products.length} products`);

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