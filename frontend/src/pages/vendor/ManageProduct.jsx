import React, { useState, useEffect } from "react";
import Title from "../../components/admin/Title";
import axios from "axios";
import { useAppContext } from "../../components/context/AppContext";

const ManageProduct = () => {

  const { user } = useAppContext();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch products
  const fetchProducts = async () => {

    try {

      setLoading(true);

      const { data } = await axios.get("/api/vendor/products");

      if (data.success) {
        setProducts(data.products);
      }

    } catch (err) {

      console.error("Fetch products error:", err.response?.data || err.message);

    } finally {

      setLoading(false);

    }

  };

  // Toggle availability
  const toggleAvailability = async (productId) => {

    try {

      setUpdatingId(productId);

      const { data } = await axios.post("/api/vendor/toggle-availability", {
        productId
      });

      if (data.success) {
        fetchProducts();
      }

    } catch (err) {

      console.error("Toggle availability error:", err.response?.data || err.message);

    } finally {

      setUpdatingId(null);

    }

  };

  // Delete product
  const deleteProduct = async (productId) => {

    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {

      const { data } = await axios.post("/api/vendor/delete-product", {
        productId
      });

      if (data.success) {
        fetchProducts();
      }

    } catch (err) {

      console.error("Delete error:", err.response?.data || err.message);

    }

  };

  useEffect(() => {

    if (user) {
      fetchProducts();
    }

  }, [user]);

  return (

    <div className="p-6 w-full">

      <Title
        title="Inventory Management"
        subTitle="Track availability and manage rental inventory."
      />

      {loading ? (

        <p className="text-gray-500 mt-4">Loading products...</p>

      ) : (

        <div className="mt-6 bg-white border rounded-lg overflow-hidden">

          <table className="w-full text-sm">

            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4 text-left">Product</th>
                <th className="p-4 text-left">Tenure Options</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>

              {products.length === 0 ? (

                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-400">
                    No products found
                  </td>
                </tr>

              ) : (

                products.map((item) => (

                  <tr key={item._id} className="border-t">

                    {/* Product */}
                    <td className="p-4 font-medium">
                      {item.name}
                    </td>

                    {/* Tenure */}
                    <td className="p-4 text-gray-600">
                      {item.tenureOptions?.join(", ")}
                    </td>

                    {/* Status */}
                    <td className="p-4 text-center">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.available
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.available ? "Available" : "Unavailable"}
                      </span>

                    </td>

                    {/* Actions */}
                    <td className="p-4">

                      <div className="flex justify-center gap-3">

                        {item.available ? (

                          <button
                            disabled={updatingId === item._id}
                            onClick={() => toggleAvailability(item._id)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded text-xs hover:bg-yellow-600"
                          >
                            Mark Unavailable
                          </button>

                        ) : (

                          <button
                            disabled={updatingId === item._id}
                            onClick={() => toggleAvailability(item._id)}
                            className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                          >
                            Mark Available
                          </button>

                        )}

                        <button
                          onClick={() => deleteProduct(item._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );

};

export default ManageProduct;