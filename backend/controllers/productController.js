import Product from '../models/Product.js';
import Store from '../models/Store.js';


// Add Product
export const addProduct = async (req, res) => {
  try {

    if (req.user.role !== "seller") {
      return res.status(403).json({ 
        success: false,
        message: `Access denied. Your role is: ${req.user.role}` 
      });
    }
    const { title, price, category, stock, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'Please upload an image' 
      });
    }

    const product = await Product.create({
      title,
      price,
      category,
      stock,
      description,
      imageURL: req.file.path,
      seller: req.user._id,
    });

    await product.save();

    return res.status(201).json({
      success: true,
      message: 'Product added successfully',
      data: product,
    });

  } catch (error) {
    console.error('ProductController Error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Server Error', 
      error: error.message 
    });
  }
};



// Get Products (With Search + Location Filter)
export const getProducts = async (req, res) => {
  try {
    const { search, latitude, longitude, radius = 10000 } = req.query;

    let filter = {};

    //  If buyer sends location, find nearby sellers via their stores
    if (latitude && longitude) {
      const nearbyStores = await Store.find({
        location: {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: [parseFloat(longitude), parseFloat(latitude)],
            },
            $maxDistance: parseInt(radius), // 10000 = 10km
          },
        },
      }).select("owner"); // owner = seller's user ID

      const nearbySellerIds = nearbyStores.map((s) => s.owner);

      // Only show products from nearby sellers
      filter.seller = { $in: nearbySellerIds };
    }

    //  Search filter (works alongside location filter)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(filter)
      .populate('seller', 'name email role')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });

  } catch (error) {
    console.error('GetProducts Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
};



// Get Seller's Own Products
export const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};



// Get Single Product
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(404).json({ message: "Product not found" });
  }
};



// Update Product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    product.title = req.body.title || product.title;
    product.price = req.body.price || product.price;
    product.stock = req.body.stock || product.stock;
    product.description = req.body.description || product.description;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};