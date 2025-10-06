// ...existing code...

// Place this route after router is defined and with other route handlers

/**
 * Update user role by MongoDB _id (admin only, for frontend compatibility)
 */

import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendVerificationEmail } from '../utils/sendVerificationEmail.js'
import {adminAuth,firebaseAuth} from '../middlewares/firebaseAuth.js'
import { assignAdminRoleIfEligible } from '../utils/adminRoleManager.js';
import { isAdminEmail, getAdminEmails } from '../config/adminConfig.js';

const router = express.Router();

/**
 * Register user (save in DB + send verification email)
 */

router.put('/:userId/role', firebaseAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      user
    });
  } catch (error) {
    console.error('Update role by _id error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});
router.post("/register", async (req, res) => {
  try {
    const { firebaseUID, email, name } = req.body;

    if (!firebaseUID || !email) {
      return res.status(400).json({ success: false, message: "Missing UID or email" });
    }

    // create or update user
    let user = await User.findOne({ firebaseUID });
    if (user) {
      if (user.isVerified) {
        return res.status(400).json({ success: false, message: "Email already registered and verified. Please login." });
      }
      // User exists but not verified → resend email
    } else {
      // Create new user
      user = await User.create({
        firebaseUID,
        email,
        name: name || "",
        isVerified: false,
      });
    }

    // Dynamically set admin role and Firebase claim
    if (isAdminEmail(user.email)) {
      try {
        await assignAdminRoleIfEligible(user.firebaseUID, user.email);
        // Update MongoDB role
        user.role = 'admin';
        await user.save();
        console.log(`✅ User ${user.email} assigned admin role during registration`);
      } catch (error) {
        console.error(`❌ Failed to assign admin role to ${user.email}:`, error);
        // Continue with registration even if admin role assignment fails
      }
    }

    // generate token
    const token = jwt.sign({ uid: firebaseUID }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const verifyUrl = `${process.env.SERVER_URL}/api/users/verify-email?token=${token}`;

    // send email
    await sendVerificationEmail(
      user.email,
      "Verify Your Email - Atomic MAS",
      `<h1>Email Verification</h1>
       <p>Please click the link below to verify your email:</p>
       <a style="display:inline-block;background:#28a745;color:#fff;
        padding:10px 20px;text-decoration:none;border-radius:5px" 
         href="${verifyUrl}">click here to verify your email</a>`
    );

    res.status(201).json({
      success: true,
      message: "User registered. Verification email sent.",
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Verify email
 */
router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.redirect(`${process.env.CLIENT_URL}/verify-email?error=invalid_token`);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { uid } = decoded;

    const user = await User.findOne({ firebaseUID: uid });
    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/verify-email?error=user_not_found`);
    }

    user.isVerified = true;
    await user.save();

    // Redirect to frontend with success message
    res.redirect(`${process.env.CLIENT_URL}/verify-email?success=true&token=${token}`);
  } catch (error) {
    console.error("Verify error:", error);
    res.redirect(`${process.env.CLIENT_URL}/verify-email?error=invalid_or_expired`);
  }
});

/**
 * Resend verification email
 */
router.post("/send-verification", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "Email already verified" });
    }

    // Generate new token
    const token = jwt.sign({ uid: user.firebaseUID }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const verifyUrl = `${process.env.SERVER_URL}/api/users/verify-email?token=${token}`;

    // Send email
    await sendVerificationEmail(
      user.email,
      "Verify Your Email - Atomic MAS",
      `<h1>Email Verification</h1>
       <p>Please click the link below to verify your email:</p>
       <a href="${verifyUrl}">${verifyUrl}</a>`
    );

    res.json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("Send verification error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Get all users (admin only)
 */
router.get("/all", async (req, res) => {
  try {
    const users = await User.find({}).select('-firebaseUID').lean();
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
});

/**
 * Update user verification status (admin only)
 */
router.put("/:userId/verify", async (req, res) => {
  try {
    const { userId } = req.params;
    const { isVerified } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isVerified },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: `User ${isVerified ? 'verified' : 'unverified'} successfully`,
      user
    });
  } catch (error) {
    console.error("Update verification error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Update user role (admin only)
 */
router.put("/set-role/:uid", firebaseAuth, async (req, res) => {
  try {
    const { uid } = req.params;
    const { role } = req.body;

    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const user = await User.findOneAndUpdate(
      { firebaseUID: uid },
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      user
    });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Login user
 */
router.post("/login", async (req, res) => {
  try {
    const { firebaseUID, email } = req.body;
    if (!firebaseUID || !email) {
      return res.status(400).json({ success: false, message: "Missing UID or email" });
    }
    let user = await User.findOne({ firebaseUID });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    // Dynamically set admin role and Firebase claim
    if (isAdminEmail(email)) {
      try {
        await assignAdminRoleIfEligible(firebaseUID, email);
        if (user.role !== 'admin') {
          user.role = 'admin';
          await user.save();
          console.log(`✅ User ${email} role updated to admin during login`);
        }
      } catch (error) {
        console.error(`❌ Failed to assign admin role to ${email} during login:`, error);
        // Continue with login even if admin role assignment fails
      }
    }
    res.json({ success: true, message: "Login successful", user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Check verification status
 */
router.get("/is-verified/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ firebaseUID: uid }).lean();

    res.json({ isVerified: !!user?.isVerified });
  } catch (error) {
    console.error("is-verified error:", error);
    res.status(500).json({ message: "Failed to get status" });
  }
});

/**
 * Manually assign admin role to a user (for debugging)
 */
router.post("/assign-admin-role", firebaseAuth, async (req, res) => {
  try {
    const { firebaseUID, email } = req.body;
    
    if (!firebaseUID || !email) {
      return res.status(400).json({ success: false, message: "Firebase UID and email are required" });
    }

    // Check if email is in admin list
    if (!isAdminEmail(email)) {
      return res.status(400).json({ success: false, message: "Email is not in admin list" });
    }

    // Assign admin role
    await assignAdminRoleIfEligible(firebaseUID, email);
    
    // Update MongoDB
    const user = await User.findOneAndUpdate(
      { firebaseUID },
      { role: 'admin' },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found in database" });
    }

    res.json({
      success: true,
      message: `Admin role assigned to ${email}`,
      user
    });
  } catch (error) {
    console.error("Assign admin role error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Get admin emails list (for debugging)
 */
router.get("/admin-emails", (req, res) => {
  try {
    const adminEmails = getAdminEmails();
    res.json({ success: true, adminEmails });
  } catch (error) {
    console.error("Get admin emails error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Check current user's admin status (for debugging)
 */
router.get("/my-admin-status", firebaseAuth, async (req, res) => {
  try {
    const { uid, email } = req.user;
    
    // Check MongoDB
    const user = await User.findOne({ firebaseUID: uid });
    
    // Check Firebase custom claims
    const hasFirebaseAdminClaim = req.user.admin === true;
    
    res.json({
      success: true,
      user: {
        email,
        firebaseUID: uid,
        mongoRole: user?.role || 'not found',
        mongoVerified: user?.isVerified || false,
        firebaseAdminClaim: hasFirebaseAdminClaim,
        isInAdminList: isAdminEmail(email)
      }
    });
  } catch (error) {
    console.error("Check admin status error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

