import Product from "../models/productModels.js";

export const createProduct = async (req,res) => {
  try {
  const { name, price, description, category, brand } = req.body;
    const image =  req.file ? `/uploads/${req.file.filename}` : '';

    const product = new Product({
     name,
    price,
    description,
    category,
    brand,
    image,
    });

    await product.save();
 res.status(201).json({
      message: "Product added successfully",
      product: product,
    });
  } catch (error) {
    console.error("Product creation error:", error);
    res.status(500).json({ message: "Failed to add product" });
  }
};
