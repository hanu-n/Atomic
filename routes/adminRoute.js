import express from 'express';
import {firebaseAuth,adminAuth} from '../middlewares/firebaseAuth.js';

const router = express.Router();

router.get('/admin',firebaseAuth,adminAuth, (req, res) => {
  if (!req.user.admin) {
    return res.status(403).json({ message: "Access denied: not an admin" });
  }
  res.json({ message: `Welcome to the admin dashboard, ${req.user.email}!` });
});

router.get("/check", firebaseAuth, (req, res) => {
  const isAdmin = req.user?.admin || false;
  res.json({ isAdmin });
});
router.get("/test-admin", firebaseAuth, adminAuth, (req, res) => {
  res.json({ message: "✅ You are an admin" });
});


export default router;