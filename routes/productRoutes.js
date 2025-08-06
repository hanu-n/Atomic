import express from "express";
import Product from "../models/productModels.js";
import upload from "../middlewares/upload.js";
import { createProduct } from "../controllers/productController.js";
import {firebaseAuth} from '../middlewares/firebaseAuth.js'

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
try {
  const {outOfStock}=req.params
  const filter={}

  if (outOfStock===true) {
    filter.countInStock ={ $lte: 0 }
  }
   const products = await Product.find(filter);
  res.json(products);
  
} catch (error) {
      console.error("❌ Error fetching products:", err);
    res.status(500).json({ message: "Failed to fetch products" });

}


 
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

// ✅ POST new product
router.post("/", async (req, res) => {
  try {
    const { name, price, stock } = req.body;

    const product = new Product({
      name,
      price,
      stock,
    });

    const saved = await product.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ message: "Error adding product" });
  }
});

// ✅ DELETE product by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (deleted) {
      res.json({ message: "Product deleted" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
});
////////////////////////////////////



router.post("/create", upload.single("image"),firebaseAuth, createProduct);



export default router;
