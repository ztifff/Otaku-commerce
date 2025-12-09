import React, { useState } from "react";
import { Navbar, Nav, Container, Form, FormControl, Button, Badge, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const categories = [
  "Accessories",
  "Apparel",
  "Figures & Collectibles",
  "Home & Lifestyle",
  "Limited Edition / Exclusives",
  "Media & Games",
  "Posters & Wall Art",
  "Stationery & School Supplies"
];

const NavigationBar = () => {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleCartClick = (e) => {
    if (!user) {
      e.preventDefault();
      alert("Please login first to view your cart!");
      navigate("/login");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
  };

  // Admin Navbar
  if (user?.role === "admin") {
    return (
      <Navbar expand="lg" className="shadow-sm sticky-top navbar-otakumart">
        <Container fluid>
          <Navbar.Brand as={Link} to="/admin/products" className="fw-bold text-primary fs-4">
            OTAKUMART Admin
          </Navbar.Brand>

          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/admin/products">Products</Nav.Link>
            <Nav.Link as={Link} to="/admin/orders">Orders</Nav.Link>
            <NavDropdown title={`${user.name}`} id="admin-dropdown" align="end">
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>
    );
  }

  // Regular User Navbar
  return (
    <Navbar expand="lg" className="shadow-sm sticky-top navbar-otakumart">
      <Container fluid className="flex-column">
        {/* Top Row */}
        <div className="d-flex w-100 justify-content-between align-items-center py-2">
          <Navbar.Brand as={Link} to="/" className="fw-bold text-primary fs-4">
            OTAKUMART
          </Navbar.Brand>

          <Form 
  className="d-flex mx-auto" 
  style={{ maxWidth: "500px", flex: 1 }} 
  onSubmit={handleSearch} // handle submit
>
  <FormControl
    type="search"
    placeholder="Search products..."
    className="me-2 rounded-pill"
    aria-label="Search"
    value={searchTerm} // controlled input
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{ color: "#000" }} // ensure text black
  />
  <Button type="submit" className="rounded-pill px-3 btn-search">
    Search
  </Button>
</Form>


          <div className="d-flex align-items-center gap-3 ms-auto">
            {user ? (
              <>
                <NavDropdown title={`${user.name}`} id="user-dropdown" align="end">
                  <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>

                <Nav.Link
                  as={Link}
                  to="/cart"
                  className="text-dark position-relative"
                  onClick={handleCartClick}
                >
                  🛒 Cart
                  <Badge
                    bg="secondary"
                    pill
                    className="position-absolute top-0 start-100 translate-middle"
                  >
                    {totalItems}
                  </Badge>
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/signup" className="text-dark">Sign Up</Nav.Link>
                <Nav.Link as={Link} to="/login" className="text-dark">Login</Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/cart"
                  className="text-dark position-relative"
                  onClick={handleCartClick}
                >
                  🛒 Cart
                  <Badge
                    bg="secondary"
                    pill
                    className="position-absolute top-0 start-100 translate-middle"
                  >
                    {totalItems}
                  </Badge>
                </Nav.Link>
              </>
            )}
          </div>
        </div>

        {/* Categories Row */}
        <Nav className="justify-content-center border-top pt-2 w-100 flex-wrap">
          {categories.map((cat) => (
            <Nav.Link
              as={Link}
              key={cat}
              to={`/products?category=${encodeURIComponent(cat)}`}
              className="text-dark mx-3 fw-semibold"
            >
              {cat}
            </Nav.Link>
          ))}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
