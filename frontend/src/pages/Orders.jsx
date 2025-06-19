import React, { useState, useEffect } from "react";
import axios from "axios";

const OrderHistory = () => {
  const [boughtOrders, setBoughtOrders] = useState([]);
  const [soldOrders, setSoldOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const boughtResponse = await axios.get(
          "http://localhost:5000/api/orders/history?type=bought",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const soldResponse = await axios.get(
          "http://localhost:5000/api/orders/history?type=sold",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const pendingResponse = await axios.get(
          "http://localhost:5000/api/orders/pending",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const verifiedBoughtOrders = boughtResponse.data.filter(
          order => order.status === 'verified'
        );
        
        setBoughtOrders(verifiedBoughtOrders || []);
        setSoldOrders(soldResponse.data || []);
        setPendingOrders(pendingResponse.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const fetchOrderOtp = async (orderId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/orders/otp/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(`OTP: ${response.data.otp}`);
    } catch (error) {
      console.error("Error fetching OTP:", error);
      alert("Error retrieving OTP");
    }
  };

  const submitReview = async (orderId, sellerId, reviewText) => {
    try {
      await axios.post(
        `http://localhost:5000/api/reviews`,
        {
          orderId,
          sellerId,
          review: {
            rating: 5, // You can change this to a dynamic rating if needed
            comment: reviewText
          }
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setReviews({
        ...reviews,
        [orderId]: reviewText
      });
      alert("Review submitted successfully");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Error submitting review");
    }
  };

  const renderOrders = (orders, showOTP = false, type) => {
    if (!Array.isArray(orders) || orders.length === 0)
      return <div>No orders found</div>;

    return orders.map((order) => (
      <div key={order._id} className="border p-4 mb-4 rounded">
        <div className="flex justify-between">
          <span>Order ID: {order._id}</span>
          <span>Total: ₹{order.totalAmount}</span>
        </div>
        
        {/* Display buyer name for sold orders */}
        {type === 'sold' && order.userId && (
          <div className="mt-2 text-sm text-gray-600">
            Buyer: {order.userId.firstName} {order.userId.lastName} ({order.userId.email})
          </div>
        )}

        {/* Display seller name for bought and pending orders */}
        {(type === 'bought' || type === 'pending') && (
          <div className="mt-2">
            {order.items.map((item, index) => (
              <div key={`${item.productId._id}-${index}`}>
                <div className="flex justify-between">
                  <span>{item.productId.title}</span>
                  <span>Qty: {item.quantity}</span>
                </div>
                {item.productId.sellerId && (
                  <div className="text-sm text-gray-600">
                    Seller: {item.productId.sellerId.firstName} {item.productId.sellerId.lastName} ({item.productId.sellerId.email})
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {showOTP && order.otpAvailable && (
          <div className="mt-2 text-sm text-blue-600">
            OTP: <button onClick={() => fetchOrderOtp(order._id)}>Reveal OTP</button>
          </div>
        )}
        
        <div className="mt-2 text-sm text-gray-500">Status: {order.status}</div>

        {/* Review form for bought orders */}
        {type === 'bought' && order.items && order.items[0] && (
          <div className="mt-4 space-y-2">
            <div className="text-sm text-gray-600">
              Seller Email: {order.items[0].productId.sellerId.email}
            </div>
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Write your review here..."
              value={reviews[order._id] || ''}
              onChange={(e) => setReviews({
                ...reviews,
                [order._id]: e.target.value
              })}
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => submitReview(
                order._id,
                order.items[0].productId.sellerId._id,
                reviews[order._id]
              )}
            >
              Submit Review
            </button>
          </div>
        )}
      </div>
    ));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex mb-4">
        {["pending", "bought", "sold"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`mr-4 px-4 py-2 ${
              activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Orders
          </button>
        ))}
      </div>
      {activeTab === "pending" && renderOrders(pendingOrders, true, "pending")}
      {activeTab === "bought" && renderOrders(boughtOrders, false, "bought")}
      {activeTab === "sold" && renderOrders(soldOrders, false, "sold")}
    </div>
  );
};

export default OrderHistory;