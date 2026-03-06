import express from 'express';
import upload from '../middleware/multer.js';
import { addProduct, getProducts, getSellerProducts, getSingleProduct, updateProduct } from '../controllers/productController.js';
import { protect, isSeller } from '../middleware/authMiddleware.js';

const router = express.Router();

//  Add product (must be seller)
router.post('/', protect,  upload.single('image'), addProduct);

//  Get all products
router.get('/', getProducts);

//  Get seller products
router.get("/seller", protect, isSeller, getSellerProducts);

router.get("/:id", getSingleProduct);
router.put("/:id", protect, isSeller, updateProduct);


export default router;