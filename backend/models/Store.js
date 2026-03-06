import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  storeName: String,
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  //  GeoJSON point for location-based queries
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0],
    },
  },

  address: {
    type: String,
    default: "",
  },
});


storeSchema.index({ location: "2dsphere" });

export default mongoose.model("Store", storeSchema);