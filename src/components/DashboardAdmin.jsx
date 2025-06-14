import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaBook,
  FaClipboardCheck,
  FaExclamationTriangle,
  FaUsers,
} from 'react-icons/fa';

const DashboardAdmin = () => {
  const navigate = useNavigate();

  const goToBookManager = () => navigate('/admin/books');
  const goToApproval = () => navigate('/admin/approval');
  const goToOverdue = () => navigate('/admin/overdue');
  const goToUserManagement = () => navigate('/admin/users');

  const cards = [
    {
      icon: <FaBook size={36} />,
      title: 'Manage Books',
      subtitle: 'Add, edit or remove books',
      bg: 'from-red-500 to-red-700',
      onClick: goToBookManager,
    },
    {
      icon: <FaClipboardCheck size={36} />,
      title: 'Approve Requests',
      subtitle: 'Handle borrow approvals',
      bg: 'from-blue-500 to-blue-700',
      onClick: goToApproval,
    },
    {
      icon: <FaExclamationTriangle size={36} />,
      title: 'Overdue Tracker',
      subtitle: 'Monitor late returns',
      bg: 'from-yellow-500 to-yellow-700',
      onClick: goToOverdue,
    },
    {
      icon: <FaUsers size={36} />,
      title: 'Manage Users',
      subtitle: 'Admin & user controls',
      bg: 'from-green-500 to-green-700',
      onClick: goToUserManagement,
    },
  ];

  return (
    <div className="min-h-screen max-w-6xl mx-auto p-6 mt-24">
      <h1 className="text-4xl font-extrabold mb-12 text-center text-gray-900 flex items-center justify-center gap-2">
         Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
        {cards.map((card, index) => (
          <button
            key={index}
            onClick={card.onClick}
            className={`flex flex-col items-center justify-center gap-2 p-8 rounded-2xl bg-gradient-to-r ${card.bg} text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition duration-300`}
          >
            {card.icon}
            <span className="text-xl font-semibold">{card.title}</span>
            <span className="text-sm font-light opacity-90">{card.subtitle}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DashboardAdmin;
