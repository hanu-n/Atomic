import express from "express";
import Product from "../models/productModels.js";
import Category from "../models/Category.js";
import upload from "../middlewares/upload.js";
import { createProduct, updateProduct } from "../controllers/productController.js";
import { firebaseAuth, adminAuth } from "../middlewares/firebaseAuth.js";

const router = express.Router();

// ✅ Fetch all or filtered products
router.get("/", async (req, res) => {
  try {
    const { category, subCategory, subSubCategory, outOfStock } = req.query;
    let filter = {};

    // Helper: normalize strings (convert to lowercase + replace dashes)
    const normalize = (str) => str?.toLowerCase().replace(/-/g, " ").trim();

    let resolvedCategory = category;
    let resolvedSub = subCategory;
    let resolvedSubSub = subSubCategory;

    // ✅ Try to resolve slugs using Category model (optional)
    if (category) {
      const catDoc = await Category.findOne({
        $or: [{ slug: category }, { name: new RegExp(`^${category}$`, "i") }],
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
        }
      }
    }

    // // ✅ Build flexible filters (case-insensitive + slug-tolerant)
    // if (resolvedCategory)
    //   filter.category = { $regex: new RegExp(`^${normalize(resolvedCategory)}`, "i") };
    // if (resolvedSub && resolvedSub !== "all")
    //   filter.subcategory = { $regex: new RegExp(`^${normalize(resolvedSub)}`, "i") };
    // if (resolvedSubSub && resolvedSubSub !== "all")
    //   filter.subSubcategory = { $regex: new RegExp(`^${normalize(resolvedSubSub)}`, "i") };

    // // ✅ Handle stock filter
    // if (outOfStock === "true") {
    //   filter.countInStock = { $lte: 0 };
    // }
    // In productroutes.js, modify the filter building section:
if (resolvedCategory) {
  // Create regex that matches both "school equipment" and "school-equipment"
  const normalizedCategory = normalize(resolvedCategory);
  filter.category = { 
    $regex: new RegExp(`^${normalizedCategory.replace(/\s+/g, '[\\s-]')}`, "i") 
  };
}

if (resolvedSub && resolvedSub !== "all") {
  const normalizedSub = normalize(resolvedSub);
  filter.subcategory = { 
    $regex: new RegExp(`^${normalizedSub.replace(/\s+/g, '[\\s-]')}`, "i") 
  };
}

if (resolvedSubSub && resolvedSubSub !== "all") {
  const normalizedSubSub = normalize(resolvedSubSub);
  filter.subSubcategory = { 
    $regex: new RegExp(`^${normalizedSubSub.replace(/\s+/g, '[\\s-]')}`, "i") 
  };
}

    console.log("🧠 Applied filter:", filter);

    const products = await Product.find(filter);
    console.log(`✅ Found ${products.length} products`);
    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// ✅ Search route
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

// ✅ Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("❌ Error retrieving product:", error);
    res.status(500).json({ message: "Error retrieving product" });
  }
});

// ✅ Delete product
router.delete("/:id", firebaseAuth, adminAuth, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
});

// ✅ Create and update routes
router.post("/", firebaseAuth, adminAuth, upload.single("image"), createProduct);
router.put("/:id", firebaseAuth, adminAuth, upload.single("image"), updateProduct);

export default router;
