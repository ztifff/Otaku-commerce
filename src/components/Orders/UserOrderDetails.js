import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const UserOrderDetails = () => {
  const { id } = useParams();
  const { token } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`https://laravel-backend-production-f902.up.railway.app/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setOrder(data || null); // backend returns order object directly
    } catch (err) {
      console.error("Failed to fetch order:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading) return <p className="text-center mt-4">Loading order...</p>;
  if (!order) return <p className="text-center mt-4">Order not found.</p>;

  return (
    <div className="container mt-4">
      <h3>Order #{order.id}</h3>
      <p>Status: {order.status}</p>
      <p>Total: ₱{order.total.toLocaleString()}</p>
      <p>Shipping Address: {order.shipping_address}</p>
      <p>Payment Method: {order.payment_method}</p>

      <h5 className="mt-3">Items</h5>
      <ul className="list-group mb-3">
        {order.order_items?.map((item) => (
          <li key={item.id}>
          {item.product.name} — {item.quantity} × ₱{item.price.toLocaleString()}
        </li>
        ))}
      </ul>

      <Link to="/orders" className="btn btn-secondary">
        Back to My Orders
      </Link>
    </div>
  );
};

export default UserOrderDetails;
