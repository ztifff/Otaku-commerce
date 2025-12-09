import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminProductList() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // initial fetch
  const [deletingId, setDeletingId] = useState(null); // for delete loading

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/"); // redirect non-admin users
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://laravel-backend-production-f902.up.railway.app/api/admin/products",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setProducts(data || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [token, user, navigate]);

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    setDeletingId(id); // start deleting
    try {
      const res = await fetch(
        `https://laravel-backend-production-f902.up.railway.app/api/admin/products/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to delete product");

      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      alert("❌ " + err.message);
      console.error(err);
    } finally {
      setDeletingId(null); // done deleting
    }
  };

  if (loading)
    return <p className="text-center mt-4">Loading products, please wait...</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Admin Product List</h2>
        <Link to="/admin/productForm" className="btn btn-primary">
          + Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table className="table table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price (₱)</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id}>
                <td>{prod.id}</td>
                <td>{prod.name}</td>
                <td>₱{prod.price.toLocaleString()}</td>
                <td className="text-center">
                  <Link
                    to={`/admin/products/edit/${prod.id}`}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteProduct(prod.id)}
                    disabled={deletingId === prod.id}
                  >
                    {deletingId === prod.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminProductList;
