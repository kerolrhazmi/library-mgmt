import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (!error) {
        setUsers(data);
      }

      setLoading(false);
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading users...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-24 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">👥 Manage Users</h1>

      {users.length === 0 ? (
        <p className="text-center text-gray-400">No users found.</p>
      ) : (
        <div className="bg-white rounded-xl shadow p-6">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600 text-sm">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Role</th>
                <th className="py-2 px-4">Profile</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-t text-sm text-gray-700">
                  <td className="py-2 px-4">{user.display_name || 'Unnamed'}</td>
                  <td className="py-2 px-4">{user.email || 'N/A'}</td>
                  <td className="py-2 px-4 capitalize">{user.role}</td>
                  <td className="py-2 px-4">
                    <Link
                      to={`/profile/${user.id}`}
                      className="text-indigo-600 hover:underline font-medium"
                    >
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
