import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


const connectionFunc=()=>{
    mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
}

export default connectionFunc

