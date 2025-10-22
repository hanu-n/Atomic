import express from "express";
import cors from "cors";
import morgan from "morgan";
import productRoutes from './routes/productRoutes.js'
import contactRoute from './routes/contactRoute.js'
import OrderRoutes from './routes/OrderRoutes.js'
import categoryRoutes  from './routes/categoryRoutes.js'
 import userRoutes from './routes/userRoutes.js'
import path from 'path';
import { fileURLToPath } from 'url';
import adminRoutes from './routes/adminRoute.js'
import paymentRoutes from './routes/paymentRoutes.js'

import connectionFunc from './config/config.js'

const app=express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(morgan("dev"));
app.use(
  cors({
    origin: [
      "https://atomic.netlify.app", // ✅ your deployed frontend
      "http://localhost:3000",      // ✅ for local testing
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);


app.use('/api/products',productRoutes)
app.use('/api/contact',contactRoute)
app.use('/api/orders',OrderRoutes)
app.use('/api/categories',categoryRoutes)
 app.use('/api/users',userRoutes)
 app.use('/api/admin',adminRoutes)
 app.use('/api/payments', paymentRoutes);



app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
     connectionFunc()
  console.log(`🚀 Server running on port ${PORT}`);
});