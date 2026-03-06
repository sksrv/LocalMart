import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api.js";
import { AuthContext } from "../../context/AuthContext.jsx";

export default function CreateStore() {
  const { refreshUser, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    storeName: "",
    description: "",
    address: "",
    latitude: "",
    longitude: "",
  });
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const [locationSet, setLocationSet] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // ✅ Use browser geolocation
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        // Reverse geocode to get address using free API
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const address = data.display_name || `${latitude}, ${longitude}`;
          setForm((prev) => ({ ...prev, latitude, longitude, address }));
        } catch {
          setForm((prev) => ({ ...prev, latitude, longitude }));
        }

        setLocationSet(true);
        setLocating(false);
      },
      () => {
        setError("Could not detect location. Please allow location access.");
        setLocating(false);
      },
      { timeout: 8000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.storeName.trim()) {
      setError("Store name is required.");
      return;
    }
    if (!form.latitude || !form.longitude) {
      setError("Please detect your location before creating the store.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await API.post("/stores", form);

      //  Refresh user role from DB — no logout needed
      await refreshUser();

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create store.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg p-8">
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Create Your Store
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Set up your store so nearby buyers can find you.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Store Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Store Name *
              </label>
              <input
                name="storeName"
                value={form.storeName}
                onChange={handleChange}
                placeholder="e.g. Fresh Grocer"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Tell buyers what you sell..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Store Location *
              </label>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={locating}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition ${
                  locationSet
                    ? "border-green-400 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700"
                    : "border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-700"
                }`}
              >
                {locating ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Detecting location...
                  </>
                ) : locationSet ? (
                  <>✅ Location Detected — Click to Update</>
                ) : (
                  <>📍 Detect My Location</>
                )}
              </button>

              {/* Show detected address */}
              {form.address && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
                  📍 {form.address}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading || !locationSet}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition mt-2"
            >
              {loading ? "Creating Store..." : "Create Store"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}