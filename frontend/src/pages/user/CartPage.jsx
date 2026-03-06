import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";

const CartPage = () => {
  const {
    cart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    totalItems,
    totalPrice,
    clearCart,
  } = useCart();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      <h2 className="text-3xl font-bold mb-10 text-gray-900 dark:text-white">
        Shopping Cart
        <span className="text-indigo-600 dark:text-indigo-400 ml-2 text-xl">
          ({totalItems} items)
        </span>
      </h2>

      {cart.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Your cart is empty 🛒
          </p>
          <Link
            to="/"
            className="mt-6 inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-md transition"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-10">
          {/* LEFT SIDE - CART ITEMS */}
          <div className="md:col-span-2 space-y-5">
            {cart.map((item) => (
              <div
                key={item.product._id}
                className="flex justify-between items-center rounded-2xl p-5 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg transition-all"
              >
                {/* LEFT */}
                <div className="flex items-center gap-5">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-24 h-24 object-cover rounded-xl border border-gray-100 dark:border-gray-800"
                  />

                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {item.product.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      ₹{item.product.price}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-6">
                  {/* Quantity */}
                  <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden">
                    <button
                      onClick={() => decreaseQty(item.product._id)}
                      className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition"
                    >
                      −
                    </button>

                    <span className="px-5 text-gray-900 dark:text-white">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => increaseQty(item.product._id)}
                      className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-medium transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE - SUMMARY */}
          <div className="rounded-2xl p-6 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 shadow-md h-fit">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              Order Summary
            </h3>

            <div className="flex justify-between mb-3 text-gray-700 dark:text-gray-300">
              <span>Items</span>
              <span>{totalItems}</span>
            </div>

            <div className="flex justify-between mb-6 text-lg font-bold text-gray-900 dark:text-white">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>

            <Link to="/checkout">
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow-md transition">
                Proceed to Checkout
              </button>
            </Link>

            <button
              onClick={clearCart}
              className="w-full mt-3 border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 transition"
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;