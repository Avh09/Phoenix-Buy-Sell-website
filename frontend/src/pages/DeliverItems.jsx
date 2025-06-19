import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeliverItems = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otpInputs, setOtpInputs] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders/deliver', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleVerifyOtp = async (orderId) => {
    const otp = otpInputs[orderId];
    if (!otp) {
      alert('Please enter OTP');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/orders/verify',
        { orderId, otp },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      // Remove the order from the list
      setOrders(orders.filter(order => order._id !== orderId));
      // Clear the OTP input for this order
      setOtpInputs(prev => {
        const newInputs = {...prev};
        delete newInputs[orderId];
        return newInputs;
      });
      alert('Transaction closed successfully');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert(error.response?.data?.message || 'Invalid OTP');
    }
  };

  const handleOtpChange = (orderId, value) => {
    setOtpInputs(prev => ({
      ...prev,
      [orderId]: value
    }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Deliver Items</h1>
      {orders.length === 0 ? (
        <div>No items to deliver</div>
      ) : (
        orders.map(order => (
          <div key={order._id} className="border p-4 mb-4 rounded">
            <div className="flex justify-between">
              <span>Order ID: {order._id}</span>
              <span>Total: ₹{order.totalAmount}</span>
            </div>
            {/* Add buyer information */}
            {order.userId && (
              <div className="mt-2 text-sm text-gray-600">
                Buyer: {order.userId.firstName} {order.userId.lastName} ({order.userId.email})
              </div>
            )}
            <div className="mt-2">
              {order.items.map((item, index) => (
                <div key={`${item.productId._id}-${index}`} className="flex justify-between">
                  <span>{item.productId.title}</span>
                  <span>Price: ₹{item.productId.price}</span>
                </div>
              ))}
            </div>
            <div className="mt-2">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otpInputs[order._id] || ''}
                onChange={(e) => handleOtpChange(order._id, e.target.value)}
                className="border p-2 mr-2"
              />
              <button
                onClick={() => handleVerifyOtp(order._id)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Close Transaction
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DeliverItems;