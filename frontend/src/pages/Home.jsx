import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import API from "../../services/api.js";
import ProductCard from "../components/ProductCard.jsx";
import Spinner from "../components/Spinner.jsx";
import Hero from "../components/Hero.jsx";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationState, setLocationState] = useState({
    coords: null,       // { latitude, longitude }
    error: null,
    asking: true,       // true while browser permission prompt is open
  });
  const [locationFiltered, setLocationFiltered] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("search") || "";

  // ── Step 1: Ask for browser location on mount ──
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationState({ coords: null, error: "Geolocation not supported", asking: false });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationState({
          coords: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          },
          error: null,
          asking: false,
        });
        setLocationFiltered(true);
      },
      () => {
        // User denied or error — show all products
        setLocationState({ coords: null, error: "Location denied", asking: false });
      },
      { timeout: 8000 }
    );
  }, []);

  // ── Step 2: Fetch products once we know location state ──
  useEffect(() => {
    if (locationState.asking) return; // wait for geolocation response first

    const fetchProducts = async () => {
      try {
        setLoading(true);

        const params = { search };

        // If we have coords, pass them to filter by nearby stores
        if (locationState.coords) {
          params.latitude = locationState.coords.latitude;
          params.longitude = locationState.coords.longitude;
          params.radius = 10000; // 10km in meters
        }

        const res = await API.get("/products", { params });
        setProducts(res.data.data);
      } catch (error) {
        console.log("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, locationState]);

  const handleDisableFilter = async () => {
    try {
      setLoading(true);
      setLocationFiltered(false);
      const res = await API.get("/products", { params: { search } });
      setProducts(res.data.data);
    } catch (error) {
      console.log("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnableFilter = async () => {
    if (!locationState.coords) return;
    try {
      setLoading(true);
      setLocationFiltered(true);
      const res = await API.get("/products", {
        params: {
          search,
          latitude: locationState.coords.latitude,
          longitude: locationState.coords.longitude,
          radius: 10000,
        },
      });
      setProducts(res.data.data);
    } catch (error) {
      console.log("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4">
      <Hero />

      {/* ── Location Status Bar ── */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          {locationState.asking ? (
            <span className="text-sm text-gray-400 animate-pulse">
              📍 Detecting your location...
            </span>
          ) : locationState.coords ? (
            <span className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              {locationFiltered ? "Showing stores within 10km" : "Location available"}
            </span>
          ) : (
            <span className="text-sm text-gray-400">
              📍 Location unavailable — showing all stores
            </span>
          )}
        </div>

        {/* Toggle filter button */}
        {locationState.coords && (
          <button
            onClick={locationFiltered ? handleDisableFilter : handleEnableFilter}
            className={`text-xs font-semibold px-4 py-1.5 rounded-full transition border ${
              locationFiltered
                ? "bg-green-50 text-green-700 border-green-300 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700"
                : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
            }`}
          >
            {locationFiltered ? "✅ Nearby Only (10km) — Show All" : "📍 Filter by Nearby (10km)"}
          </button>
        )}
      </div>

      {/* ── Products Grid ── */}
      {loading ? (
        <Spinner />
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="text-center mt-16 space-y-3">
          <p className="text-gray-400 text-lg">
            {locationFiltered
              ? "No stores found within 10km of your location."
              : "No products found."}
          </p>
          {locationFiltered && (
            <button
              onClick={handleDisableFilter}
              className="text-sm text-indigo-600 hover:underline"
            >
              Show all stores instead
            </button>
          )}
        </div>
      )}
    </div>
  );
}