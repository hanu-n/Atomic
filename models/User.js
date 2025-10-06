import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firebaseUID: { type: String, required: true, unique: true }, // from Firebase
  email: { type: String, required: true, unique: true },
  name: { type: String },
  isVerified: { type: Boolean, default: false },     
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
  phone: { type: String },
  address: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

export default User;
