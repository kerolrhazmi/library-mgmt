import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const goToBookManager = () => {
    navigate('/admin/books'); // This should match your route for AdminBookManager
  };

  return (
    <div className="max-w-4xl mx-auto p-8 mt-[100px]">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <button
        onClick={goToBookManager}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
      >
        Manage Books
      </button>
      
      {/* You can add more admin features/buttons here later */}
    </div>
  );
};

export default AdminDashboard;
