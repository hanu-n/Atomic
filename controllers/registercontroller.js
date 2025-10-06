// controllers/userController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";

export const registerUser = async (req, res) => {
  try {
    const { firebaseUID, email, name } = req.body;

    if (!firebaseUID || !email) {
      return res.status(400).json({ message: "Firebase UID and email are required" });
    }

    // 1. Save or update user in DB (unverified at first)
    let user = await User.findOne({ firebaseUID });

    if (!user) {
      user = await User.create({
        firebaseUID,
        email,
        name: name || "",
        isVerified: false,
      });
    }

    // 2. Create verification token
    const token = jwt.sign({ uid: firebaseUID }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    // 3. Send verification email
    await sendEmail(
      email,
      "Verify Your Email - Atomic MAS",
      `<h1>Email Verification</h1>
       <p>Please click the link below to verify your email:</p>
       <a href="${verifyUrl}">${verifyUrl}</a>`
    );

    res.status(201).json({
      success: true,
      message: "User synced. Please check your email for verification.",
      user,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
