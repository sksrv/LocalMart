import jwt from "jsonwebtoken";
import User from "../models/User.js";

//  Verify JWT token
export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authorized, no token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

//  Check if user is a seller 
export const isSeller = (req, res, next) => {
  console.log("=== isSeller DEBUG ===");
  console.log("req.user:", req.user);
  console.log("role:", req.user?.role);
  if (req.user && req.user.role === "seller") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Sellers only." });
  }
};