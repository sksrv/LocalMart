import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import Store from "../models/Store.js";
import User from "../models/User.js";



const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe); 

export default router;