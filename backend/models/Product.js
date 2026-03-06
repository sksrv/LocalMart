import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, "Stock count is required"],
      default: 0,
    },
    imageURL: {
      type: String, // Stores the path or Cloudinary URL
      required: [true, "Product image is required"],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Links the product to the logged-in seller
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);