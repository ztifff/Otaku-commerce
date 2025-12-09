import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Table, Button, Spinner } from 'react-bootstrap';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cartItems, removeFromCart, updateCartItemQuantity } = useCart();
  const navigate = useNavigate();

  const [loadingItemId, setLoadingItemId] = useState(null); // track which item is loading

  const increaseQty = async (item) => {
    setLoadingItemId(item.id);
    try {
      const newQty = (item.quantity || 1) + 1;
      await updateCartItemQuantity(item.id, newQty);
    } finally {
      setLoadingItemId(null);
    }
  };

  const decreaseQty = async (item) => {
    const current = item.quantity || 1;
    if (current <= 1) return;
    setLoadingItemId(item.id);
    try {
      const newQty = current - 1;
      await updateCartItemQuantity(item.id, newQty);
    } finally {
      setLoadingItemId(null);
    }
  };

  const handleRemove = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from your cart?`)) return;

    setLoadingItemId(id);
    try {
      await removeFromCart(id);
      alert(`🗑️ "${name}" has been removed from your cart.`);
    } finally {
      setLoadingItemId(null);
    }
  };

  const getTotal = () =>
    cartItems.reduce(
      (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1),
      0
    );

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/checkout');
  };

  return (
    <Container className="app-container">
      <h2 className="fw-bold mb-4">Your Cart</h2>

      {cartItems.length === 0 ? (
        <div className="text-center">
          <p>Your cart is currently empty.</p>
          <Link to="/products" className="btn btn-primary me-2">Continue Shopping</Link>
          <Link to="/orders" className="btn btn-secondary">View My Orders</Link>
        </div>
      ) : (
        <>
          <Table bordered hover responsive className="align-middle">
            <thead className="table-light">
              <tr>
                <th>Product</th>
                <th style={{ width: 160 }}>Quantity</th>
                <th style={{ width: 150 }}>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td className="d-flex align-items-center gap-3">
                  <img
                  src={`https://laravel-backend-production-f902.up.railway.app${item.product?.image || ''}`}
                  alt={item.product?.name || 'Product'}
                   width="70"
               height="70"
               style={{ objectFit: 'cover', borderRadius: 8 }}
/>

                    <div>
                      <p className="m-0 fw-semibold">{item.product?.name || 'Product'}</p>
                      <p className="text-muted small m-0">₱{(item.product?.price || 0).toLocaleString()}</p>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center justify-content-center">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => decreaseQty(item)}
                        disabled={loadingItemId === item.id}
                      >
                        {loadingItemId === item.id ? <Spinner animation="border" size="sm" /> : "-"}
                      </Button>
                      <span className="mx-3">{item.quantity || 1}</span>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => increaseQty(item)}
                        disabled={loadingItemId === item.id}
                      >
                        {loadingItemId === item.id ? <Spinner animation="border" size="sm" /> : "+"}
                      </Button>
                    </div>
                  </td>
                  <td>₱{((item.product?.price || 0) * (item.quantity || 1)).toLocaleString()}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemove(item.id, item.product?.name || 'Product')}
                      disabled={loadingItemId === item.id}
                    >
                      {loadingItemId === item.id ? <Spinner animation="border" size="sm" /> : "Remove"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="d-flex justify-content-end align-items-center mt-4 gap-3">
            <h5 className="me-3">
              Subtotal: <span className="text-primary">₱{getTotal().toLocaleString()}</span>
            </h5>
            <Button variant="primary" onClick={handleCheckout}>Checkout</Button>
            <Button variant="secondary" onClick={() => navigate('/orders')}>View My Orders</Button>
          </div>
        </>
      )}
    </Container>
  );
}

export default Cart;
