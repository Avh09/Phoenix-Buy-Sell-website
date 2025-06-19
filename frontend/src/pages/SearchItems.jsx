import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchItems = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [orderedProductIds, setOrderedProductIds] = useState([]); // IDs of products that have been ordered
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  // Fetch all items and categories when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsResponse, categoriesResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/product'),
          axios.get('http://localhost:5000/api/categories')
        ]);
        setItems(itemsResponse.data);
        setCategories(categoriesResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  

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

  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      }
      return [...prev, category];
    });
  };

  // Filter items based on search query and selected categories
  const filteredItems = items.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
  
    const matchesCategories = selectedCategories.length === 0 || 
      selectedCategories.includes(item.category);
  
    // Exclude items posted by the logged-in user
    const isNotLoggedInUser = item.sellerId !== userId;

    // Exclude items that have already been ordered
    const isNotOrdered = !orderedIds.includes(item._id);
  
    return matchesSearch && matchesCategories && isNotLoggedInUser && isNotOrdered;
  });
  

  // Navigate to item details page
  const handleItemClick = (itemId) => {
    navigate(`/product/${itemId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar with category filters */}
        <div className="w-full md:w-64 space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <div className="space-y-2">
              {categories.map(category => (
                <div key={category} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="w-4 h-4"
                  />
                  <label htmlFor={category} className="text-sm font-medium">
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1">
          {/* Search bar */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Items grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map(item => (
              <div 
                key={item._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-4"
                onClick={() => handleItemClick(item._id)}
              >
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">₹{item.price}</span>
                  <div className="flex flex-col items-end">
                    <span className="text-sm text-gray-500">{item.category}</span>
                    <span className="text-xs text-gray-400">Seller: {item.sellerName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No items found matching your criteria
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchItems;