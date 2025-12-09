import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, Image, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Checkout() {
  const { cartItems, fetchCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: '',
    zipcode: '',
    email: '',
    payment: ''
  });

  const handleInput = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.firstName || !form.lastName || !form.address || !form.payment) {
      alert("⚠️ Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://laravel-backend-production-f902.up.railway.app/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // user token
        },
        body: JSON.stringify({
          shipping_address: `${form.address}, ${form.city}, ${form.country}, ${form.zipcode}`,
          payment_method: form.payment,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      alert(`✅ Order placed successfully!`);

      await fetchCart(); // cart cleared

      navigate(`/orders/${data.order.id}`);
    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="app-container">
      <h2 className="fw-bold mb-4">Checkout</h2>

      <Form onSubmit={handleSubmit}>
        <Row className="g-4">

          {/* LEFT SIDE - ADDRESS */}
          <Col md={5}>
            <h5>Delivery Address</h5>

            <Row>
              <Col>
                <Form.Control
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleInput}
                  className="mb-2"
                />
              </Col>
              <Col>
                <Form.Control
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleInput}
                  className="mb-2"
                />
              </Col>
            </Row>

            <Form.Control
              name="address"
              placeholder="Address"
              className="mb-2"
              value={form.address}
              onChange={handleInput}
            />

            <Form.Control
              name="city"
              placeholder="City"
              className="mb-2"
              value={form.city}
              onChange={handleInput}
            />

            <Row>
              <Col>
                <Form.Control
                  name="country"
                  placeholder="Country"
                  className="mb-2"
                  value={form.country}
                  onChange={handleInput}
                />
              </Col>
              <Col>
                <Form.Control
                  name="zipcode"
                  placeholder="Zipcode"
                  className="mb-2"
                  value={form.zipcode}
                  onChange={handleInput}
                />
              </Col>
            </Row>
          </Col>

          {/* MIDDLE - PAYMENT */}
          <Col md={4}>
            <h5>Payment Method</h5>

            <Form.Check
              type="radio"
              label="Cash on Delivery"
              name="payment"
              value="COD"
              onChange={handleInput}
            />
            <Form.Check
              type="radio"
              label="Credit Card"
              name="payment"
              value="Credit Card"
              onChange={handleInput}
              className="mb-3"
            />

            <Form.Control
              type="email"
              name="email"
              placeholder="Email"
              className="mb-2"
              value={form.email}
              onChange={handleInput}
            />
          </Col>

          {/* RIGHT SIDE — CART SUMMARY */}
          <Col md={3}>
            <h5>Products Ordered</h5>

            <div className="border rounded p-2 mb-2">
              {cartItems.map((item) => (
                <div key={item.id} className="d-flex align-items-center mb-2">
                  <Image
                    src={product.image_url} alt={product.name}

                    width={60}
                    height={60}
                    rounded
                    style={{ objectFit: "cover" }}
                  />
                  <div className="ms-2 flex-grow-1 small">
                    <strong>{item.product.name}</strong>
                    <div>₱{item.product.price.toLocaleString()}</div>
                    <div>Qty: {item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>

            <h6 className="text-end">
              Total: <span className="fw-bold text-danger">₱{total.toLocaleString()}</span>
            </h6>

            <Button
              type="submit"
              className="w-100 mt-3"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" /> Placing Order...
                </>
              ) : (
                "Place Order"
              )}
            </Button>

          </Col>

        </Row>
      </Form>
    </Container>
  );
}

export default Checkout;
