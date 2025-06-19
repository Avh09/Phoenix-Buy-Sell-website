import React from "react";
import Profile from "./Profile";
import profileImage from '../assets/profile.jpg'; // Adjust the path to your image file

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex flex-1">
        <main className="flex-1 py-6 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <p className="text-lg italic text-gray-600 text-center">
                "Success in business is not just about making profits; it's
                about creating value through honest exchanges and building
                lasting relationships."
              </p>
            </div>
          </div>
        </main>
        <aside className="w-1/3 min-w-[400px] p-6 border-l border-gray-200 bg-white">
          <div className="flex flex-col items-center mb-6">
            <img
              src={profileImage}
              alt="Profile"
              className="rounded-full w-32 h-32 mb-4"
            />
          </div>
          <Profile />
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
