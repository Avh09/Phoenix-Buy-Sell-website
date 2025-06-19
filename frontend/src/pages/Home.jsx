import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo3.png'; // Adjust the path to your logo image

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <img src={logo} alt="App Logo" className="w-32 h-32 mb-4" /> {/* Add the logo image */}
      <h1 className="text-4xl font-bold mb-4">Pheonix</h1>
      <div className="space-x-4">
        <Link to="/signup" className="text-lg text-indigo-600 hover:text-indigo-800">
          Sign Up
        </Link>
        <Link to="/login" className="text-lg text-indigo-600 hover:text-indigo-800">
          Log In
        </Link>
      </div>
    </div>
  );
};

export default Home;