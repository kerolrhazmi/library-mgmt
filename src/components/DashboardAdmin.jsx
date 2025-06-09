import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBook, FaClipboardCheck } from 'react-icons/fa';

const DashboardAdmin = () => {
  const navigate = useNavigate();

  const goToBookManager = () => {
    navigate('/admin/books');
  };

  const goToApproval = () => {
    navigate('/admin/approval');
  };

  return (
    <div className="max-w-4xl mx-auto p-8 mt-24">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-900">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
      </div>
    </div>
  );
};

export default DashboardAdmin;
