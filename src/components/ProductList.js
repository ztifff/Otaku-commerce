import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import { useProducts } from "../data/products";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ProductCard({ product, onAdd, adding }) {
  return (
    <Card className="card-product h-100">
      <div className="product-img">
        <img src={`https://laravel-backend-production-f902.up.railway.app/${product.image}`} alt={product.name} />
      </div>
      <Card.Body className="p-3 d-flex flex-column">
        <div className="mb-2">
          <div className="product-name">{product.name}</div>
          <div className="text-muted small">{product.category?.name || product.category}</div>
        </div>

        <div className="mt-auto d-flex justify-content-between align-items-center">
          <div className="product-price">₱{Number(product.price).toLocaleString()}</div>
          <div>
            <Button
              as={Link}
              to={`/product/${product.id}`}
              size="sm"
              variant="outline-primary"
              className="me-2"
            >
              View
            </Button>
            <Button
              size="sm"
              onClick={() => onAdd(product)}
              disabled={adding}
            >
              {adding ? "Adding..." : "Add"}
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

function ProductList() {
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const query = useQuery();
  const navigate = useNavigate();
  const category = query.get("category");
  const searchTerm = query.get("search")?.toLowerCase() || "";

  const [addingId, setAddingId] = useState(null); // track product being added

  const handleAdd = async (product) => {
    if (!user) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    setAddingId(product.id);
    try {
      await addToCart(product, 1);
    } catch (err) {
      alert("Failed to add to cart: " + err.message);
    } finally {
      setAddingId(null);
    }
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-4" />;
  if (error) return <Alert variant="danger">Error fetching products: {error.message}</Alert>;

  // Filter products by category and search term
  let filtered = products;
  if (category) {
    filtered = filtered.filter(
      (p) => (p.category?.name || p.category)?.toLowerCase() === category.toLowerCase()
    );
  }

  if (searchTerm) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        (p.category?.name || p.category)?.toLowerCase().includes(searchTerm)
    );
  }

  return (
    <main className="app-container">
      <Container>
        <h2 className="fw-bold mb-4 text-center">
          {category ? category : searchTerm ? `Results for "${searchTerm}"` : "All Products"}
        </h2>
        {filtered.length === 0 ? (
          <p className="text-center">No products found.</p>
        ) : (
          <Row xs={1} sm={2} md={3} lg={4} className="g-3">
            {filtered.map((product) => (
              <Col key={product.id}>
                <ProductCard
                  product={product}
                  onAdd={handleAdd}
                  adding={addingId === product.id}
                />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </main>
  );
}

export default ProductList;
