import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ItemsPage from './pages/ItemsPage';
import SearchItems from './pages/SearchItems';
import Product from './pages/Product';
import Cart from './pages/Cart';
import OrderHistory from './pages/Orders';
import SellPage from './pages/SellPage';
import DeliverItems from './pages/DeliverItems';
import ChatBot from './pages/ChatBot'; // Import the ChatBot component

const App = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const publicRoutes = ['/', '/login', '/signup'];
    
    if (token) {
      // If token exists and user is on a public route, redirect to dashboard
      if (publicRoutes.includes(location.pathname)) {
        navigate('/dashboard');
      }
    } else {
      // If no token, redirect to login for protected routes
      const protectedRoutes = ['/dashboard', '/items', '/search', '/product', '/cart', '/orders', '/sell', '/deliver', '/gemini'];
      if (protectedRoutes.some(route => location.pathname.startsWith(route))) {
        navigate('/login');
      }
    }
  }, [navigate, token, location.pathname]);

  return (
    <CartProvider> {/* Wrap your app with CartProvider */}
      <div>
        {token && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/search" element={<SearchItems />} />
          <Route path="/items" element={<ItemsPage />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/sell" element={<SellPage />} />
          <Route path="/deliver" element={<DeliverItems />} />
          <Route path="/chat" element={<ChatBot />} /> {/* Add the ChatBot route */}
          
        </Routes>
      </div>
    </CartProvider>
  );
};

export default App;