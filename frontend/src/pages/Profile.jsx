import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    contactNumber: '',
  });
  const [isEditing, setIsEditing] = useState(false); // New state for edit mode

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            console.log('Token expired or invalid');
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && data.data) {
          setUser(data.data);
          // Preserve existing values if they're not in the response
          setFormData(prevData => ({
            firstName: data.data.firstName || prevData.firstName || '',
            lastName: data.data.lastName || prevData.lastName || '',
            email: data.data.email || prevData.email || '',
            age: data.data.age || prevData.age || '',
            contactNumber: data.data.contactNumber || prevData.contactNumber || '',
          }));
        } else {
          throw new Error(data.message || 'Failed to load profile data');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (error.message.includes('token failed')) {
          localStorage.removeItem('token');
          navigate('/login');
        }
        alert('Error loading profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'contactNumber' && value.length > 10) {
      return;
    }
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) return; // Prevent submission if not in edit mode
    
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        alert('Profile updated successfully!');
        setUser(data.data);
        // Preserve existing values when updating
        setFormData(prevData => ({
          firstName: data.data.firstName || prevData.firstName || '',
          lastName: data.data.lastName || prevData.lastName || '',
          email: data.data.email || prevData.email || '',
          age: data.data.age || prevData.age || '',
          contactNumber: data.data.contactNumber || prevData.contactNumber || '',
        }));
        setIsEditing(false);
      } else {
        alert(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg ">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No profile data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm w-full">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div>
        <div className="flex items-center mb-4">
          {/* <img src="https://via.placeholder.com/100" alt="User Avatar" className="rounded-full mr-4" /> */}
          <div>
            <h3 className="text-xl font-semibold">{formData.firstName} {formData.lastName}</h3>
            <p className="text-gray-600">{formData.email}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={!isEditing} // Disable input if not editing
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={!isEditing} // Disable input if not editing
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.email}
              onChange={handleInputChange}
              disabled // Email field is always disabled
            />
          </div>
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
            <input
              id="age"
              name="age"
              type="number"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.age}
              onChange={handleInputChange}
              disabled={!isEditing} // Disable input if not editing
            />
          </div>
          <div>
            <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input
              id="contactNumber"
              name="contactNumber"
              type="text"
              required
              maxLength="10" // Limit input to 10 digits
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.contactNumber}
              onChange={handleInputChange}
              disabled={!isEditing} // Disable input if not editing
            />
          </div>
          <div>
             {!isEditing ? (
            <button
              type="button" // This is important
              onClick={handleEdit}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-4">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Update Profile
              </button>
              <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;