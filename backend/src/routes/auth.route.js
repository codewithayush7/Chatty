import express from "express";
import {
  login,
  logout,
  onboard,
  signup,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import User from "../models/User.js"; // ← ADD THIS IMPORT

const router = express.Router();

// TEST ROUTE
router.post("/test", (req, res) => {
  console.log("🧪 TEST ROUTE CALLED");
  res.json({ message: "Test successful" });
});

// DEBUG ROUTE
router.get("/check-user/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      hasVerificationToken: !!user.emailVerificationToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// FORCE VERIFY ROUTE
router.post("/force-verify", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("BEFORE:", {
      isEmailVerified: user.isEmailVerified,
      hasToken: !!user.emailVerificationToken,
    });

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    user.lastVerificationEmailSentAt = undefined;

    await user.save();

    console.log("AFTER:", {
      isEmailVerified: user.isEmailVerified,
      hasToken: !!user.emailVerificationToken,
    });

    res.json({
      message: "User verified successfully",
      isEmailVerified: user.isEmailVerified,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// LIST ALL USERS - Add this route
router.get("/list-users", async (req, res) => {
  try {
    const users = await User.find({}).select("email fullName isEmailVerified");
    res.json({
      count: users.length,
      users: users.map((u) => ({
        email: u.email,
        fullName: u.fullName,
        isEmailVerified: u.isEmailVerified,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", protectRoute, resendVerificationEmail);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);
router.post("/onboarding", protectRoute, onboard);

router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
