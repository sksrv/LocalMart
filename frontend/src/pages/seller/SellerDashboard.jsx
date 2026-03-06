import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../../services/api";
import { PackagePlus } from "lucide-react";

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchSellerProducts = async () => {
      try {
        const { data } = await API.get("/products/seller");
        setProducts(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSellerProducts();
  }, []);

  return (
    <div className="min-h-[80vh] px-4 py-10 
                    bg-gray-50 dark:bg-gray-900 
                    transition-colors duration-300">

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold 
                           text-gray-800 dark:text-gray-100">
              Seller Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Manage your products easily.
            </p>
          </div>

          <Link
            to="/add-product"
            className="inline-flex items-center gap-2 
                       bg-black text-white 
                       dark:bg-white dark:text-black 
                       px-5 py-2 rounded-lg 
                       hover:bg-gray-800 
                       dark:hover:bg-gray-200 
                       transition"
          >
            <PackagePlus size={18} />
            Add Product
          </Link>
        </div>

        {/* Product Table */}
        <div className="bg-white dark:bg-gray-800 
                        rounded-2xl shadow-md 
                        dark:shadow-black/30 
                        overflow-hidden transition-colors">

          {products.length === 0 ? (
            <p className="p-6 text-gray-500 dark:text-gray-400">
              No products added yet.
            </p>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="p-4 text-sm font-medium text-gray-600 dark:text-gray-200">
                    Product
                  </th>
                  <th className="p-4 text-sm font-medium text-gray-600 dark:text-gray-200">
                    Price
                  </th>
                  <th className="p-4 text-sm font-medium text-gray-600 dark:text-gray-200">
                    Stock
                  </th>
                  <th className="p-4 text-sm font-medium text-gray-600 dark:text-gray-200">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-t border-gray-200 dark:border-gray-700"
                  >
                    <td className="p-4 text-gray-800 dark:text-gray-100">
                      {product.title}
                    </td>

                    <td className="p-4 text-gray-700 dark:text-gray-300">
                      ₹{product.price}
                    </td>

                    <td className="p-4 text-gray-700 dark:text-gray-300">
                      {product.stock}
                    </td>

                    <td className="p-4">
                      <Link
                        to={`/edit-product/${product._id}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>
      </div>
    </div>
  );
}