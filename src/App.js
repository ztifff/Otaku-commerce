import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Homepage from './components/HomePage';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Footer from './components/Footer';
import Signup from './pages/Signup';
import Login from './pages/Login';

// USER ORDER PAGES
import UserOrderList from './components/Orders/UserOrderList';
import UserOrderDetails from './components/Orders/UserOrderDetails';

// ADMIN PAGES
import AdminLogin from './components/Admin/AdminLogin';
import AdminProductForm from "./components/Admin/AdminProductForm";
import AdminProductEdit from "./components/Admin/AdminProductEdit";
import AdminProductList from "./components/Admin/AdminProductList";
import AdminOrderList from './components/Orders/AdminOrderList';
import AdminOrderDetails from './components/Orders/AdminOrderDetails';

import { CartProvider } from './context/CartContext';
import { AuthProvider } from "./context/AuthContext";

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />

          <div>
            <Routes>
              {/* Public Pages */}
              <Route path="/" element={<Homepage />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />

              {/* User Orders */}
              <Route path="/orders" element={<UserOrderList />} />
              <Route path="/orders/:id" element={<UserOrderDetails />} />

              {/* Admin Pages */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/productForm" element={<AdminProductForm />} /> {/* Add */}
              <Route path="/admin/products/edit/:id" element={<AdminProductEdit />} /> {/* Edit */}
              <Route path="/admin/products" element={<AdminProductList />} />
              <Route path="/admin/orders" element={<AdminOrderList />} />
              <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
            </Routes>
          </div>

          <Footer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
