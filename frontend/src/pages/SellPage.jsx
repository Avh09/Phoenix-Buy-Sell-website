import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SellPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    sellerId: localStorage.getItem('userId'),
    sellerName: localStorage.getItem('userName')
  });

  useEffect(() => {
    const fetchItems = async () => {
      const sellerId = localStorage.getItem('userId');
      
      if (!sellerId) {
        console.error('No seller ID found in localStorage');
        return;
      }
      
      try {
        // Fetch all items listed by the seller
        const response = await axios.get(`http://localhost:5000/api/product/seller/${sellerId}`);
        let listedItems = response.data;
  
        // Fetch sold items
        const soldResponse = await axios.get('http://localhost:5000/api/orders/history?type=sold', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } // If using JWT
        });
  
        const soldItems = soldResponse.data.flatMap(order => 
          order.items.map(item => item.productId._id)
        );
  
        // Filter out sold items
        console.log('Sold items:', soldItems);
        listedItems = listedItems.filter(item => !soldItems.includes(item._id));
  
        setItems(listedItems);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching items:', error);
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/reviews/${localStorage.getItem('userId')}`,
          {
            headers: { 
              Authorization: `Bearer ${localStorage.getItem('token')}` 
            }
          }
        );
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
  
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
  
    fetchItems();
    fetchCategories();
    fetchReviews();
  }, []);
  

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/product', newItem);
      setNewItem({
        title: '',
        description: '',
        price: '',
        category: '',
        sellerId: localStorage.getItem('userId'),
        sellerName: localStorage.getItem('userName')
      });
      const response = await axios.get(`http://localhost:5000/api/product/seller/${localStorage.getItem('userId')}`);
      setItems(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Seller Dashboard</h1>

      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">My Reviews</h2>
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet</p>
          ) : (
            reviews.map((review, index) => (
              <div key={index} className="border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{review.reviewerId.firstName} {review.reviewerId.lastName}</p>
                    <p className="text-gray-600 mt-1">{review.comment}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
        <form onSubmit={handleAddItem} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Item Name"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <textarea
              placeholder="Description"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="w-full p-2 border rounded"
              required
              rows="3"
            />
          </div>
          <button 
            type="submit" 
            className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Item
          </button>
        </form>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div key={category} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryItems.map(item => (
                <div key={item._id} className="border rounded-lg p-4 hover:shadow-lg transition">
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">₹{item.price}</span>
                    <span className="text-sm text-gray-500">{item.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellPage;