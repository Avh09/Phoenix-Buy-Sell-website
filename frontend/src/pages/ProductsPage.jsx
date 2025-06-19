import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Import the useCart hook

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const userId = localStorage.getItem('userId'); // Get logged-in user ID

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching products...");
        const response = await axios.get('http://localhost:5000/api/product');
        console.log("Fetched products:", response.data);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter out the seller's own products
  const filteredProducts = products.filter(product => 
    (product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    product.sellerId !== userId // Exclude products where sellerId matches logged-in user
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <input 
        type="text" 
        placeholder="Search products..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map(product => (
          <div 
            key={product._id} 
            className="border rounded p-4 hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            <h3 className="font-bold">{product.title}</h3>
            <p className="text-gray-600 truncate">{product.description}</p>
            <div className="mt-2 flex justify-between items-center">
              <span className="font-semibold">₹{product.price}</span>
              <span className="text-sm text-gray-500">{product.category}</span>
            </div>
            <div className="mt-1 text-sm text-gray-500">
  Sold by: {product.sellerName}
</div>

            <button 
              onClick={(e) => {
                e.stopPropagation(); // Prevent navigation
                addToCart({ ...product, quantity: 1 }); // Add product to cart
                alert('Product added to cart!');
              }}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add to Cart
            </button>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No products found
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
