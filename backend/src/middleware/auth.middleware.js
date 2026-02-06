import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized, no token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized, user not found" });
    }

    // 🔐 Invalidate JWT if password was changed
    if (user.passwordChangedAt) {
      const passwordChangedAtTimestamp = Math.floor(
        new Date(user.passwordChangedAt).getTime() / 1000,
      );

      if (decoded.iat < passwordChangedAtTimestamp) {
        return res.status(401).json({
          message: "Session expired. Please log in again.",
        });
      }
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const verifiedOnly = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      message: "Please verify your email to access this feature",
    });
  }
  next();
};
