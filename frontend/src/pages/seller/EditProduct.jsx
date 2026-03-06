import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../services/api.js";
export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  //  Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setTitle(data.title);
        setPrice(data.price);
        setStock(data.stock);
        setDescription(data.description);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [id]);

  // Update product
  const updateHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.put(`/products/${id}`, {
        title,
        price,
        stock,
        description,
      });

      alert("Product updated successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Error updating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 
                    bg-gray-50 dark:bg-gray-900 transition-colors">

      <div className="w-full max-w-lg 
                      bg-white dark:bg-gray-800 
                      rounded-2xl shadow-md 
                      dark:shadow-black/30 p-8">

        <h1 className="text-2xl font-semibold mb-6 
                       text-gray-800 dark:text-gray-100">
          Edit Product
        </h1>

        <form onSubmit={updateHandler} className="space-y-4">

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Product Title"
            className="w-full px-4 py-2 rounded-lg border 
                       border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700
                       text-gray-800 dark:text-gray-100"
          />

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            className="w-full px-4 py-2 rounded-lg border 
                       border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700
                       text-gray-800 dark:text-gray-100"
          />

          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Stock"
            className="w-full px-4 py-2 rounded-lg border 
                       border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700
                       text-gray-800 dark:text-gray-100"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full px-4 py-2 rounded-lg border 
                       border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700
                       text-gray-800 dark:text-gray-100"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg 
                       bg-black text-white 
                       dark:bg-white dark:text-black 
                       hover:bg-gray-800 
                       dark:hover:bg-gray-200 transition"
          >
            {loading ? "Updating..." : "Update Product"}
          </button>

        </form>
      </div>
    </div>
  );
}