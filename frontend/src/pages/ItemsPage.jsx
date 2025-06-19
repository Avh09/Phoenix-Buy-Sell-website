import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Import the useCart hook

const ItemsPage = () => {
  const [items, setItems] = useState([]);
  const [orderedProductIds, setOrderedProductIds] = useState([]); // IDs of products that have been ordered
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const userId = localStorage.getItem('userId'); // Get logged-in user ID

  // Fetch items from the API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        console.log("Fetching items...");
        const response = await axios.get('http://localhost:5000/api/product');
        console.log("Fetched items:", response.data);
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Fetch orders and extract product IDs that have been ordered
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log("Fetching orders...");
        const res = await axios.get('http://localhost:5000/api/orders/allorders',{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }); // Adjust the endpoint if needed
        console.log("Fetched orders:", res.data);

        // Collect all ordered product IDs in a Set to avoid duplicates
        const productIdsSet = new Set();
        res.data.forEach(order => {
          if (order.items && Array.isArray(order.items)) {
            order.items.forEach(orderedItem => {
              productIdsSet.add(orderedItem.productId);
            });
          }
        });
        // console.log("Ordered product IDs:", Array.from(productIdsSet));
        // Convert Set back to an array
        setOrderedProductIds(Array.from(productIdsSet));
        // console.log("Ordered product IDs:", orderedProductIds);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  // Filter out the seller's own items and those that have already been ordered
  const orderedIds = orderedProductIds.map(product => product._id);
  const filteredItems = items.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
  
    const notSeller = item.sellerId !== userId;
    // Check if the current item's _id is not in the orderedIds array
    const notOrdered = !orderedIds.includes(item._id);
  
    return matchesSearch && notSeller && notOrdered;
  });
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <input 
        type="text" 
        placeholder="Search items..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map(item => (
          <div 
            key={item._id} 
            className="border rounded p-4 hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate(`/product/${item._id}`)}
          >
            <h3 className="font-bold">{item.title}</h3>
            <p className="text-gray-600 truncate">{item.description}</p>
            <div className="mt-2 flex justify-between items-center">
              <span className="font-semibold">₹{item.price}</span>
              <span className="text-sm text-gray-500">{item.category}</span>
            </div>
            <div className="mt-1 text-sm text-gray-500">
              Sold by: {item.sellerName}
            </div>

            <button 
              onClick={(e) => {
                e.stopPropagation(); // Prevent navigation when clicking the button
                addToCart({ ...item, quantity: 1 }); // Add item to cart
                alert('Item added to cart!');
              }}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add to Cart
            </button>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No items found
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemsPage;
