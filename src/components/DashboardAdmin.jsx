import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBook, FaClipboardCheck, FaExclamationTriangle, FaUsers } from 'react-icons/fa'; // Added FaUsers icon

const DashboardAdmin = () => {
  const navigate = useNavigate();

  const goToBookManager = () => {
    navigate('/admin/books');
  };

  const goToApproval = () => {
    navigate('/admin/approval');
  };

  const goToOverdue = () => {
    navigate('/admin/overdue');
  };

  const goToUserManagement = () => {
    navigate('/admin/users'); // 👈 Make sure this route is defined in your router
  };

  return (
    <div className="min-h-screen max-w-6xl mx-auto p-8 mt-24">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-900">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <button
          onClick={goToBookManager}
          className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl bg-red-600 hover:bg-red-700 shadow-lg transition text-white font-semibold text-lg"
          aria-label="Manage Books"
        >
          <FaBook size={40} />
          Manage Books
        </button>

        <button
          onClick={goToApproval}
          className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg transition text-white font-semibold text-lg"
          aria-label="Approve Borrow Requests"
        >
          <FaClipboardCheck size={40} />
          Approve Borrow Requests
        </button>

        <button
          onClick={goToOverdue}
          className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl bg-yellow-600 hover:bg-yellow-700 shadow-lg transition text-white font-semibold text-lg"
          aria-label="Track Overdue Books"
        >
          <FaExclamationTriangle size={40} />
          Track Overdue Books
        </button>

        {/* ✅ New Manage Users Button */}
        <button
          onClick={goToUserManagement}
          className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl bg-green-600 hover:bg-green-700 shadow-lg transition text-white font-semibold text-lg"
          aria-label="Manage Users"
        >
          <FaUsers size={40} />
          Manage Users
        </button>
      </div>
    </div>
  );
};

export default DashboardAdmin;
