import express from "express";
import Order from "../models/Order.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ POST /api/orders — create order after successful payment
router.post("/", protect, async (req, res) => {
  try {
    const { items, totalAmount, paymentIntentId, sellerId } = req.body;

    if (!items || !totalAmount || !paymentIntentId || !sellerId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ Handle sellerId whether it's a string ID or a full object
    const sellerIdValue = typeof sellerId === "object" ? sellerId._id : sellerId;

    if (!sellerIdValue) {
      return res.status(400).json({ message: "Invalid sellerId" });
    }

    // Prevent duplicate orders for same payment
    const existing = await Order.findOne({ paymentIntentId });
    if (existing) {
      return res.status(200).json(existing);
    }

    const order = await Order.create({
      buyer: req.user._id,
      seller: sellerIdValue,
      items,
      totalAmount,
      paymentIntentId,
      status: "confirmed",
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET /api/orders/my-orders — buyer sees their orders
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET /api/orders/seller-orders — seller sees their orders
router.get("/seller-orders", protect, async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Access denied" });
    }
    const orders = await Order.find({ seller: req.user._id })
      .populate("buyer", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//  /api/orders/:id/status — seller updates order status
router.patch("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, seller: req.user._id },
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;