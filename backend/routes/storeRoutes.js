import express from "express";
import { createStore, getNearbyStores } from "../controllers/storeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createStore);
router.get("/nearby", getNearbyStores); 

export default router;