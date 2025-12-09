// src/context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false); // for fetch cart
  const [actionLoading, setActionLoading] = useState(false); // for add/update/delete

  // Fetch cart from backend
  const fetchCart = async () => {
    if (!user) return setCartItems([]);
    setLoading(true);
    try {
      const res = await fetch(`http://192.168.99.100:8082/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch cart");

      const normalized = (data.cartItems || []).map(item => ({
        id: item.id,
        quantity: item.quantity,
        product: item.product || {
          id: item.product_id,
          name: item.name,
          price: item.price,
          image: item.image
        }
      }));
      setCartItems(normalized);
    } catch (err) {
      console.error(err.message);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      alert("Please login first!");
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch(`http://192.168.99.100:8082/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: product.id, quantity }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add to cart");

      const normalized = (data.cartItems || []).map(item => ({
        id: item.id,
        quantity: item.quantity,
        product: item.product || {
          id: item.product_id,
          name: item.name,
          price: item.price,
          image: item.image
        }
      }));
      setCartItems(normalized);

      alert(`🛒 ${quantity} × ${product.name} added to cart!`);
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const updateCartItemQuantity = async (id, quantity) => {
    if (!user) return;
    setActionLoading(true);
    try {
      const res = await fetch(`http://192.168.99.100:8082/api/cart/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update cart");

      const normalized = (data.cartItems || []).map(item => ({
        id: item.id,
        quantity: item.quantity,
        product: item.product || {
          id: item.product_id,
          name: item.name,
          price: item.price,
          image: item.image
        }
      }));
      setCartItems(normalized);
    } catch (err) {
      console.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const removeFromCart = async (id) => {
    if (!user) return;
    setActionLoading(true);
    try {
      const res = await fetch(`http://192.168.99.100:8082/api/cart/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to remove item");

      const normalized = (data.cartItems || []).map(item => ({
        id: item.id,
        quantity: item.quantity,
        product: item.product || {
          id: item.product_id,
          name: item.name,
          price: item.price,
          image: item.image
        }
      }));
      setCartItems(normalized);
    } catch (err) {
      console.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.product?.price || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        fetchCart,
        totalItems,
        cartTotal,
        loading,
        actionLoading, // new state
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
