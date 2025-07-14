import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/productSchema.js";
import products from "./data/products.js";
import connectionFunc from './config/config.js'

dotenv.config()
connectionFunc()

const importData=async()=>{
try {
    await Product.deleteMany();
    await Product.insertMany(products);

     console.log("✅ Sample products imported!");
    process.exit();
} catch (error) {
     console.error("❌ Error importing products:", error);
    process.exit(1);
}
}

importData()