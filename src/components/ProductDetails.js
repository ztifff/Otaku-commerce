import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { useProducts } from "../data/products";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function ProductDetails() {
  const { id } = useParams();
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false); // loading state

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-4" />;
  if (error) return <Alert variant="danger">Error: {error.message}</Alert>;

  const product = products.find((p) => p.id === Number(id));
  if (!product)
    return (
      <Container className="app-container">
        <p>Product not found.</p>
      </Container>
    );

  const handleAdd = async () => {
    if (!user) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    setAdding(true);
    try {
      await addToCart(product, quantity);
    } catch (err) {
      alert("Failed to add to cart: " + err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    setAdding(true);
    try {
      await addToCart(product, quantity);
      navigate("/checkout");
    } catch (err) {
      alert("Failed to add to cart: " + err.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <main className="app-container">
      <Container>
        <h2 className="fw-bold mb-4">Product Details</h2>
        <Row className="g-4">
          <Col md={5} className="text-center">
          <img
  src={`https://laravel-backend-production-f902.up.railway.app/${product.image}`}
  alt={product.name}
  className="img-fluid rounded"
  style={{ maxHeight: 400, objectFit: "contain" }}
/>

          </Col>

          <Col md={7}>
            <h3 className="fw-bold">{product.name}</h3>
            <p className="fs-4 text-danger">
              ₱{Number(product.price).toLocaleString()}
            </p>
            <p className="text-muted">{product.description}</p>

            <div className="d-flex align-items-center gap-3 mb-3">
              <label className="fw-semibold mb-0">Quantity:</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="form-control"
                style={{ width: 100 }}
                disabled={adding}
              />
            </div>

            <div>
              <Button
                variant="primary"
                className="me-2"
                onClick={handleAdd}
                disabled={adding}
              >
                {adding ? "Adding..." : "Add to Cart"}
              </Button>
              <Button
                variant="success"
                onClick={handleBuyNow}
                disabled={adding}
              >
                {adding ? "Adding..." : "Buy Now"}
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  );
}

export default ProductDetails;
