import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminOrderList = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://laravel-backend-production-f902.up.railway.app/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Failed to fetch admin orders:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading)
    return <p className="text-center mt-4">Loading orders, please wait...</p>;

  return (
    <div className="container mt-4">
      <h3>Admin — Order List</h3>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="table mt-3">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Total Items</th>
              <th>Total (₱)</th>
              <th>Status</th>
              <th>Placed On</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user.name}</td>
                <td>{order.items_count}</td>
                <td>₱{order.total.toLocaleString()}</td>
                <td>{order.status}</td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
                <td>
                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="btn btn-sm btn-primary"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrderList;
