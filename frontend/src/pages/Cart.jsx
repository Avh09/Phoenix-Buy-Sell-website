import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, fetchCart } = useCart();
  const [orderResponse, setOrderResponse] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const totalAmount = cartItems.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);

  useEffect(() => {
    fetchCart();
  }, []);

  const handleOrder = async () => {
    try {
      const orderPayload = {
        cartItems: cartItems.map(item => ({
          productId: item.productId._id,
          quantity: 1,
        })),
        totalAmount,
      };

      const response = await axios.post('http://localhost:5000/api/orders', orderPayload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = response.data;
      setOrderResponse(data);
      clearCart();
      setError(null);

      // Show the OTP in an alert
      alert(`Your OTP is: ${data.plainOtp}. Please note it down.`);

      // Navigate to orders page to update the order history
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      setError(error.message);
    }
  };

  if (cartItems.length === 0) {
    return <div>Your cart is empty.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      
      {error && (
        <div className="bg-red-200 p-2 mb-4 rounded text-red-800">
          {error}
        </div>
      )}

      {orderResponse && (
        <div className="bg-green-200 p-2 mb-4 rounded">
          Order placed successfully!
        </div>
      )}

      <div>
        {cartItems.map(item => (
          <div key={item.productId._id} className="flex justify-between items-center border-b py-2">
            <div>
              <h2 className="font-semibold">{item.productId.title}</h2>
              <p>Price: ₹{item.productId.price}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
            <button
              onClick={() => removeFromCart(item.productId._id)}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 text-right font-bold text-xl">
        Total: ₹{totalAmount}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={clearCart}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Clear Cart
        </button>
        <button
          onClick={handleOrder}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={cartItems.length === 0}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Cart;