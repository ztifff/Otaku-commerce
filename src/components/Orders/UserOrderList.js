import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const UserOrderList = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // loading state

  const fetchOrders = async () => {
    setLoading(true); // start loading
    try {
      const res = await fetch("https://laravel-backend-production-f902.up.railway.app/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setOrders(data || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
    setLoading(false); // end loading
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading)
    return <p className="text-center mt-4">Loading orders...</p>;

  return (
    <div className="container mt-4">
      <h3>Your Orders</h3>

      {orders.length === 0 ? (
        <p className="mt-3">You have no orders yet.</p>
      ) : (
        <table className="table mt-3">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>₱{order.total}</td>
                <td>{order.status}</td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
                <td>
                  <Link
                    to={`/orders/${order.id}`}
                    className="btn btn-primary btn-sm"
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

export default UserOrderList;
