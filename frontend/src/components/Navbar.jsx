import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    navigate('/'); // Navigate to home page
  };

  return (
    <nav className="bg-white shadow-lg pt-4"> {/* Added pt-4 for padding on top */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <h1 className="text-xl font-bold text-gray-800">Pheonix</h1>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/dashboard" className="text-gray-500 hover:text-gray-700">Dashboard</Link>
              <Link to="/cart" className="text-gray-500 hover:text-gray-700">Cart</Link>
              <Link to="/orders" className="text-gray-500 hover:text-gray-700">Orders</Link>
              <Link to="/items" className="text-gray-500 hover:text-gray-700">Items</Link>
              <Link to="/sell" className="text-gray-500 hover:text-gray-700">Sell</Link>
              <Link to="/deliver" className="text-gray-500 hover:text-gray-700">Deliver Items</Link> {/* New Deliver Items Link */}
              <Link to="/chat" className="text-gray-500 hover:text-gray-700">Chat Support</Link> {/* New Chat Support Link */}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/search"
              className="flex items-center text-gray-500 hover:text-gray-700"
            >
              <Search className="w-5 h-5 mr-1" />
              Search
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:bg-gray-100 rounded-md px-4 py-2"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;