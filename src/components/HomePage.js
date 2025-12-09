// src/components/Homepage.jsx
import React from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useProducts } from '../data/products'; // import the hook

const CATEGORIES = [
  "Accessories",
  "Apparel",
  "Figures & Collectibles",
  "Home & Lifestyle",
  "Limited Edition / Exclusives",
  "Media & Games",
  "Posters & Wall Art",
  "Stationery & School Supplies"
];

function CategoryBlock({ title, items }) {
  return (
    <section className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4 className="section-title">{title}</h4>
        <Link to={`/products?category=${encodeURIComponent(title)}`} className="small">View All</Link>
      </div>

      <Row xs={1} sm={2} md={4} lg={4} className="g-3">
        {items.map((p) => (
          <Col key={p.id}>
            <Card className="card-product h-100">
              <div className="product-img">
              <img src={p.image_url} alt={p.name} />

              </div>
              <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <div className="product-name">{p.name}</div>
                    <div className="text-muted small">{p.category?.name || p.category}</div>
                  </div>
                  <div className="product-price">₱{Number(p.price).toLocaleString()}</div>
                </div>
                <div className="d-flex justify-content-between">
                  <Button as={Link} to={`/product/${p.id}`} size="sm" variant="outline-primary">View</Button>
                  <Button as={Link} to={`/product/${p.id}`} size="sm">Buy</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
}

function Homepage() {
  // Use the hook to fetch products
  const { products, loading, error } = useProducts();

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">Error fetching products: {error.message}</Alert>;

  return (
    <main className="app-container">
      <Container>
        <div className="hero-banner">
          <p className="mb-0 fw-semibold">🎉 Limited Time Discount: Plushies & Figures!</p>
        </div>

        {CATEGORIES.map((cat) => {
          // For each category, filter products from the API
          const items = products.filter((p) => {
            // If backend returns category object
            if (p.category && p.category.name) return p.category.name === cat;
            // If JSON used plain string
            return p.category === cat;
          }).slice(0, 6);

          if (items.length === 0) return null;

          return <CategoryBlock key={cat} title={cat} items={items} />;
        })}
      </Container>
    </main>
  );
}

export default Homepage;
