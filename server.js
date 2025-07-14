import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import productRoutes from './routes/productRoutes.js'

import connectionFunc from './config/config.js'

const app=express()
app.use(morgan("dev"));
app.use(cors())

app.use('/api/products',productRoutes)




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
     connectionFunc()
  console.log(`🚀 Server running on port ${PORT}`);
});