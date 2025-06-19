// import React from 'react';
// import { Link } from 'react-router-dom';

// const ProductCard = ({ product }) => {
//   return (
//     <Link to={`/product/${product._id}`} className="block">
//       <div className="border rounded p-4 hover:shadow-lg transition">
//         <h3 className="font-bold">{product.title}</h3>
//         <p className="text-gray-600">{product.description}</p>
//         <div className="flex justify-between items-center mt-2">
//           <span className="font-semibold">₹{product.price}</span>
//           <span className="text-sm text-gray-500">
//             {product.sellerId?.name || 'Unknown Seller'}
//           </span>
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default ProductCard;

import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/product/${product._id}`)} // Navigate to product page
    >
      {product.image && (
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
      <h3 className="text-lg font-semibold">{product.title}</h3>
      <p className="text-gray-600">₹{product.price}</p>
      <p className="text-sm text-gray-500">Category: {product.category}</p>
      <p className="text-sm text-gray-500">Sold by: {product.sellerId?.name || 'Unknown Seller'}</p>
    </div>
  );
};

export default ProductCard;