import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminOrderDetails = () => {
  const { id } = useParams();
  const { token } = useAuth();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false); // NEW

  const fetchOrder = async () => {
    try {
      const res = await fetch(
        `http://192.168.99.100:8082/api/admin/orders/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      setOrder(data.order);
      setStatus(data.order.status);
    } catch (err) {
      console.error("Failed to fetch admin order:", err);
    }
    setLoading(false);
  };

  const updateStatus = async () => {
    setIsUpdating(true); // START
    try {
      const res = await fetch(
        `http://192.168.99.100:8082/api/admin/orders/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) throw new Error("Failed to update status");

      alert("Order status updated!");
      fetchOrder();
    } catch (err) {
      alert(err.message);
    }
    setIsUpdating(false); // END
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (!order) return <p className="text-center mt-4">Order not found.</p>;

  return (
    <div className="container mt-4">
      <h3>Admin — Order #{order.id}</h3>

      <p>Customer: {order.user.name}</p>
      <p>Email: {order.user.email}</p>
      <p>Total: ₱{order.total}</p>

      <h5>Status</h5>
      <select
        className="form-select w-25"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="pending">Pending</option>
        <option value="paid">Paid</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <button
        className="btn btn-success mt-2"
        onClick={updateStatus}
        disabled={isUpdating} // disable button
      >
        {isUpdating ? "Updating..." : "Update Status"} {/* spinner text */}
      </button>

      <h5 className="mt-4">Items</h5>
      <ul className="list-group mb-3">
        {order.items.map((item) => (
          <li key={item.id} className="list-group-item">
            {item.product.name} — {item.quantity} × ₱{item.product.price}
          </li>
        ))}
      </ul>

      <Link to="/admin/orders" className="btn btn-secondary">
        Back to Orders
      </Link>
    </div>
  );
};

export default AdminOrderDetails;
