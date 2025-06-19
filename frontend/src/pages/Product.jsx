import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import placeholderImage from '../assets/prod1.jpeg'; // Adjust the path as needed

const Product = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/product/${id}`);
        console.log('Fetched product:', response.data); // Log the fetched product
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await axios.post('http://localhost:5000/api/cart/add', {
        productId: id,
        quantity: 1
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Include token
        }
      });
      alert('Added to cart successfully!');
      // Add the product to the cart context as well
      addToCart({ ...product, quantity: 1}); // Ensure you have access to addToCart
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex">
        <div className="w-1/2">
          {/* Placeholder for product image */}
          <img src={placeholderImage} alt={product.title} className="h-96 w-full object-cover" />
        </div>
        <div className="w-1/2 pl-8">
          <h1 className="text-2xl font-bold">{product.title}</h1>
          
          <p className="text-gray-600 mt-2">{product.description}</p>
          {product.sellerId && (
            <p className="text-sm text-gray-500 mt-1">Sold by: {product.sellerName}</p>
          )}
          <div className="mt-4">
            <span className="text-xl font-semibold">₹{product.price}</span>
          </div>
          <div className="mt-4">
            <label className="block mb-2">Quantity</label>
            <input 
              type="number" 
              min="1" 
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="border p-2 w-20"
            />
          </div>
          <button 
            onClick={handleAddToCart}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;