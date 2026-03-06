import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import axios from "axios";
import CheckoutForm from "../../components/CheckoutForm.jsx";
import { useCart } from "../../context/CartContext.jsx";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const { totalPrice } = useCart(); //  real cart total

  useEffect(() => {
    if (!totalPrice || totalPrice <= 0) return;

    axios
      .post("http://localhost:5000/api/payment/create-payment-intent", {
        amount: totalPrice, //  key matches backend
      })
      .then((res) => {
        setClientSecret(res.data.clientSecret);
      })
      .catch((err) => {
        console.error("Payment Intent Error:", err.response?.data || err);
        setError("Failed to initialize payment. Please try again.");
      });
  }, [totalPrice]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg animate-pulse">
          Initializing payment...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Complete Payment
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Total:{" "}
          <span className="font-semibold text-indigo-600">₹{totalPrice}</span>
        </p>

        <Elements stripe={stripePromise} options={{ clientSecret }} key={clientSecret}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
}