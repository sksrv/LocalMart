import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function ProductCard({ product }) {
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    // Stop click from navigating to product page
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleCardClick = () => {
    navigate(`/products/${product._id}`);
  };

  // Format price with commas e.g. 1,299
  const formatPrice = (price) =>
    Number(price).toLocaleString("en-IN");

  // Discount badge — show only if product has originalPrice
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={handleCardClick}
      className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-lg dark:hover:shadow-indigo-900/20 transition-all duration-200 cursor-pointer flex flex-col"
    >
      {/* ── Image Container ── */}
      <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-800 aspect-square">
        <img
          src={
            imgError || !product.imageURL
              ? "https://placehold.co/400x400?text=No+Image"
              : product.imageURL
          }
          alt={product.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Discount badge */}
        {discount && (
          <div className="absolute top-2.5 left-2.5 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
            -{discount}%
          </div>
        )}

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-xs font-semibold px-3 py-1.5 rounded-lg">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick add button — appears on hover */}
        {product.stock !== 0 && (
          <motion.button
            onClick={handleAddToCart}
            initial={{ opacity: 0, y: 8 }}
            whileHover={{ scale: 1.02 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-2.5 left-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 rounded-xl shadow-lg"
          >
            {added ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Added!
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-4H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </>
            )}
          </motion.button>
        )}
      </div>

      {/* ── Content ── */}
      <div className="p-3.5 flex flex-col flex-1">

        {/* Store name */}
        {product.store?.storeName && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
              <span className="text-[9px]">🏪</span>
            </div>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium truncate">
              {product.store.storeName}
            </p>
          </div>
        )}

        {/* Product title */}
        <h2 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 leading-snug flex-1">
          {product.title || product.name}
        </h2>

        {/* Category tag */}
        {product.category && (
          <span className="inline-block mt-1.5 text-[10px] font-medium text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-md w-fit">
            {product.category}
          </span>
        )}

        {/* Price row */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 dark:border-gray-800">
          <div className="flex flex-col">
            <span className="font-bold text-base text-gray-900 dark:text-white">
              ₹{formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">
                ₹{formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Stock indicator */}
          {product.stock > 0 && product.stock <= 5 && (
            <span className="text-[10px] font-semibold text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-lg">
              Only {product.stock} left
            </span>
          )}

          {product.stock > 5 && (
            <span className="text-[10px] font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
              In Stock
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}