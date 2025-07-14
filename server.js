import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import admin from "firebase-admin"
import connectionFunc from './config/config.js'

const app=express()



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    // connectionFunc()
  console.log(`🚀 Server running on port ${PORT}`);
});