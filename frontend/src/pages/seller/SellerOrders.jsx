import { useEffect, useState } from "react";
import axios from "axios";

const statusColors = {
  confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  shipped: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const STATUS_OPTIONS = ["confirmed", "shipped", "delivered", "cancelled"];

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    axios
      .get("http://localhost:5000/api/orders/seller-orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => { setOrders(res.data); setLoading(false); })
      .catch(() => { setError("Failed to load orders."); setLoading(false); });
  }, []);

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: res.data.status } : o))
      );
    } catch {
      alert("Failed to update status.");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400 animate-pulse text-lg">Loading orders...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500">{error}</p>
    </div>
  );

  // Stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const delivered = orders.filter((o) => o.status === "delivered").length;
  const pending = orders.filter((o) => o.status === "confirmed" || o.status === "shipped").length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 min-h-screen bg-white dark:bg-gray-950">
      <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Seller Orders</h2>
      <p className="text-gray-500 mb-8">Manage and track orders from your customers</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-5 text-center">
          <p className="text-2xl font-bold text-indigo-600">{orders.length}</p>
          <p className="text-sm text-gray-500 mt-1">Total Orders</p>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-5 text-center">
          <p className="text-2xl font-bold text-green-600">₹{totalRevenue}</p>
          <p className="text-sm text-gray-500 mt-1">Total Revenue</p>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-5 text-center">
          <p className="text-2xl font-bold text-yellow-500">{pending}</p>
          <p className="text-sm text-gray-500 mt-1">Active Orders</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No orders received yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-6"
            >
              {/* Header */}
              <div className="flex justify-between items-start flex-wrap gap-2 mb-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Order ID</p>
                  <p className="text-sm font-mono text-gray-600 dark:text-gray-300">{order._id}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </p>
                </div>

                {/* Status Dropdown */}
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                  <select
                    value={order.status}
                    disabled={updating === order._id}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="text-sm border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Buyer Info */}
              {order.buyer && (
                <div className="mb-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm">
                  <p className="text-gray-500">Customer</p>
                  <p className="font-medium text-gray-900 dark:text-white">{order.buyer.name}</p>
                  <p className="text-gray-500">{order.buyer.email}</p>
                </div>
              )}

              {/* Items */}
              <div className="space-y-3 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-16 h-16 object-cover rounded-xl border border-gray-100 dark:border-gray-800"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{item.product.title}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.product.price}</p>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ₹{item.quantity * item.product.price}
                    </p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between">
                <p className="text-gray-500 text-sm">Order Total</p>
                <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">₹{order.totalAmount}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}