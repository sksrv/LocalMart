import Store from "../models/Store.js";
import User from "../models/User.js";

//  Create store with location
export const createStore = async (req, res) => {
  try {
    const { storeName, description, latitude, longitude, address } = req.body;

    if (!storeName) {
      return res.status(400).json({ message: "Store name is required" });
    }

    const existing = await Store.findOne({ owner: req.user._id });
    if (existing) {
      return res.status(400).json({ message: "You already have a store" });
    }

    const store = await Store.create({
      storeName,
      description,
      owner: req.user._id,
      address: address || "",
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude) || 0, parseFloat(latitude) || 0],
      },
    });

    //  Update user role to seller in DB so new token reflects it
    await User.findByIdAndUpdate(req.user._id, { role: "seller" });

    res.status(201).json(store);
  } catch (error) {
    console.error("Create store error:", error);
    res.status(500).json({ message: error.message });
  }
};

//  Get nearby stores within 10km radius
export const getNearbyStores = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10000 } = req.query;

    if (!latitude || !longitude) {
      const stores = await Store.find().populate("owner", "name email");
      return res.json(stores);
    }

    const stores = await Store.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseInt(radius),
        },
      },
    }).populate("owner", "name email");

    res.json(stores);
  } catch (error) {
    console.error("Get nearby stores error:", error);
    res.status(500).json({ message: error.message });
  }
};