import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminProductEdit() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    price: "",
    category_id: "",
    description: "",
    image: null,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false); // for update
  const [fetching, setFetching] = useState(true); // for initial data

  // Redirect non-admin users
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          "http://192.168.99.100:8082/api/admin/categories",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        alert(err.message);
      }
    };
    fetchCategories();
  }, [token]);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      setFetching(true);
      try {
        const res = await fetch(
          `http://192.168.99.100:8082/api/admin/products/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setForm({
          name: data.name,
          price: data.price,
          category_id: data.category.id,
          description: data.description,
          image: null,
        });
      } catch (err) {
        alert(err.message);
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("category_id", form.category_id);
      if (form.image) formData.append("image", form.image);
      formData.append("_method", "PUT");

      const res = await fetch(
        `http://192.168.99.100:8082/api/admin/products/${id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update product");

      alert("✅ Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return <p className="text-center mt-4">Loading product details...</p>;

  return (
    <div className="container mt-4">
      <h3>Edit Product</h3>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          name="name"
          value={form.name}
          placeholder="Product Name"
          className="form-control mb-2"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          value={form.price}
          placeholder="Price"
          className="form-control mb-2"
          onChange={handleChange}
          required
        />
        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          className="form-control mb-2"
          required
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <textarea
          name="description"
          value={form.description}
          placeholder="Description"
          className="form-control mb-2"
          onChange={handleChange}
        />
        <input
          type="file"
          name="image"
          className="form-control mb-2"
          onChange={handleChange}
          accept="image/*"
        />
        <button className="btn btn-success" disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
}

export default AdminProductEdit;
