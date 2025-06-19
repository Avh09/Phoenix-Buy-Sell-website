// CartContext.jsx
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = async (product) => {
    try {
      const response = await axios.post('http://localhost:5000/api/cart/add', 
        {
          productId: product._id,
          quantity: product.quantity
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // Update local state with the response from server
      setCartItems(response.data.items);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCartItems(response.data.items);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete('http://localhost:5000/api/cart/clear', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCartItems(response.data.items);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      clearCart,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};