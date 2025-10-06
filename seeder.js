import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from './models/productModels.js';
import connectionFunc from './config/config.js';
import Category from './models/Category.js';

import categories from "./data/catagory.js";
import productsData from "./data/products.js"; 

dotenv.config();
connectionFunc();

const importData = async () => {
  try {
    await Product.deleteMany();
    await Category.deleteMany();
   
    const createdCategories = await Category.insertMany(categories);

    // Map categories and subcategories
    const categoryMap = {};
    const subCategoryMap = {}; 
    const subSubCategoryMap = {};

    createdCategories.forEach(cat => {
      categoryMap[cat.slug] = cat.slug; // Map slug to slug for direct comparison

      cat.subCategories.forEach(sub => {
        subCategoryMap[sub.slug] = sub.slug; // Map subcategory slug to slug
        
        if (sub.subCategories) {
          sub.subCategories.forEach(subSub => {
            subSubCategoryMap[subSub.slug] = subSub.slug; // Map sub-subcategory slug to slug
          });
        }
      });
    });

    // Attach category + subcategory + subSubcategory properly to each product
    const products = productsData.map(p => ({
      ...p,
      category: p.category, // Use the category slug directly
      subcategory: p.subcategory, // Use the subcategory slug directly
      subSubcategory: p.subSubcategory // Use the subSubcategory slug directly
    }));
    products.forEach(product => {
  if (!product.image || product.image.trim() === "") {
    product.image = "https://via.placeholder.com/300?text=No+Image";
  }
});


    await Product.insertMany(products);

    console.log("✅ Sample products imported with subcategories!");
    process.exit();
  } catch (error) {
    console.error("❌ Error importing products:", error);
    process.exit(1);
  }
};

importData();
