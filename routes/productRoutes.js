import express from "express";
import Product from "../models/productModels.js";
import Category from "../models/Category.js";
import upload from "../middlewares/upload.js";
import { createProduct,updateProduct } from "../controllers/productController.js";
import { firebaseAuth,adminAuth } from "../middlewares/firebaseAuth.js";

const router = express.Router();


// ✅ GET all products (with filters, now slug-tolerant)
router.get("/", async (req, res) => {
  try {
    const { category, subCategory, subSubCategory, outOfStock } = req.query;
    let filter = {};

    // Resolve slugs to stored category/subcategory names when possible.
    // Nav links use slugs (eg. 'school-equipment') while products store human-readable names.
    let resolvedCategory = category;
    let resolvedSub = subCategory;
    let resolvedSubSub = subSubCategory;

    if (category) {
      // Try to find a Category document by slug or (case-insensitive) name
      const catDoc = await Category.findOne({ $or: [{ slug: category }, { name: new RegExp(`^${category}$`, 'i') }] });
      if (catDoc) {
        resolvedCategory = catDoc.name;
        // If subCategory is provided as a slug, try to resolve it from the category doc
        if (subCategory && subCategory !== 'all') {
          const foundSub = catDoc.subCategories?.find(s => s.slug === subCategory || new RegExp(`^${subCategory}$`, 'i').test(s.name));
          if (foundSub) resolvedSub = foundSub.name;
          // If subSubCategory present, try to resolve under foundSub
          if (foundSub && subSubCategory && subSubCategory !== 'all') {
            const foundSubSub = foundSub.subCategories?.find(ss => ss.slug === subSubCategory || new RegExp(`^${subSubCategory}$`, 'i').test(ss.name));
            if (foundSubSub) resolvedSubSub = foundSubSub.name;
          }
        }
      }
    }

   // Normalize and make matching flexible (ignores spaces/dashes/case)
const normalize = (str) => str?.replace(/[-\s]+/g, '').toLowerCase();

if (resolvedCategory) {
  const normalized = normalize(resolvedCategory);
  filter.$expr = {
    $regexMatch: {
      input: { $replaceAll: { input: { $toLower: "$category" }, find: "-", replacement: "" } },
      regex: normalized
    }
  };
}
if (resolvedSub && resolvedSub !== "all") {
  const normalized = normalize(resolvedSub);
  filter.$expr = {
    $regexMatch: {
      input: { $replaceAll: { input: { $toLower: "$subcategory" }, find: "-", replacement: "" } },
      regex: normalized
    }
  };
}
if (resolvedSubSub && resolvedSubSub !== "all") {
  const normalized = normalize(resolvedSubSub);
  filter.$expr = {
    $regexMatch: {
      input: { $replaceAll: { input: { $toLower: "$subSubcategory" }, find: "-", replacement: "" } },
      regex: normalized
    }
  };
}

    console.log("Applied filter:", filter);

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