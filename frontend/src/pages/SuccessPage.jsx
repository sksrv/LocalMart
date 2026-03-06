import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useCart } from "../context/CartContext";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const clientSecret = searchParams.get("payment_intent_client_secret");
  const paymentIntentId = searchParams.get("payment_intent");
  const { cart, totalPrice, clearCart } = useCart();

  useEffect(() => {
    if (!clientSecret) { setStatus("failed"); return; }

    stripePromise.then(async (stripe) => {
      const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

      if (paymentIntent.status === "succeeded") {
        setStatus("success");

        //  Save order to database
        try {
          const token = localStorage.getItem("token");
          //  seller is populated object — extract just the _id string
          const rawSeller = cart[0]?.product?.seller || cart[0]?.product?.store;
          const sellerId = typeof rawSeller === "object" ? rawSeller?._id : rawSeller;

          //  Use token from user object in localStorage
          const userObj = JSON.parse(localStorage.getItem("user"));
          const authToken = userObj?.token;

          await axios.post(
            "http://localhost:5000/api/orders",
            {
              items: cart,
              totalAmount: totalPrice,
              paymentIntentId,
              sellerId,
            },
            { headers: { Authorization: `Bearer ${authToken}` } }
          );

          clearCart(); //  Clear cart after order saved
        } catch (err) {
          console.error("Order save error:", err);
          // Don't change status — payment was still successful
        }
      } else if (paymentIntent.status === "processing") {
        setStatus("processing");
      } else {
        setStatus("failed");
      }
    });
  }, [clientSecret]);

  const states = {
    loading: { icon: "⏳", title: "Checking payment...", msg: "Please wait.", color: "text-gray-500" },
    success: { icon: "✅", title: "Payment Successful!", msg: "Your order has been placed and saved.", color: "text-green-600" },
    processing: { icon: "🔄", title: "Payment Processing", msg: "We'll confirm your order shortly.", color: "text-yellow-500" },
    failed: { icon: "❌", title: "Payment Failed", msg: "Something went wrong. Please try again.", color: "text-red-500" },
  };

  const current = states[status];

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 px-4">
      <div className="text-center p-10 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg max-w-md w-full">
        <div className="text-6xl mb-4">{current.icon}</div>
        <h1 className={`text-3xl font-bold mb-2 ${current.color}`}>{current.title}</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{current.msg}</p>

        <div className="flex flex-col gap-3">
          {status === "success" && (
            <Link
              to="/my-orders"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              View My Orders
            </Link>
          )}
          {status === "failed" ? (
            <Link to="/checkout" className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition">
              Try Again
            </Link>
          ) : (
            <Link to="/" className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-semibold transition hover:bg-gray-100 dark:hover:bg-gray-800">
              Continue Shopping
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}