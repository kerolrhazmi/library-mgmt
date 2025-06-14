import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('profiles').select('*');
      if (!error) {
        setUsers(data);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const admins = users.filter((u) => u.role === 'admin');
  const normalUsers = users.filter((u) => u.role === 'user');

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading users...</div>;
  }

  const UserTable = ({ title, userList }) => (
    <div className="w-full md:w-[48%] bg-white rounded-xl shadow p-6 mb-[80px]">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">{title}</h2>
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-600 uppercase tracking-wider">
          <tr>
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Role</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user) => (
            <tr key={user.id} className="border-t hover:bg-gray-50 transition">
              <td className="py-2 px-4">
                <Link
                  to={`/profile/${user.id}`}
                  className="text-indigo-600 hover:underline font-medium"
                >
                  {user.display_name || 'Unnamed'}
                </Link>
              </td>
              <td className="py-2 px-4 capitalize">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto mt-[150px] px-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center"> Manage Users</h1>
      {users.length === 0 ? (
        <p className="text-center text-gray-400">No users found.</p>
      ) : (
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <UserTable title="Admins" userList={admins} />
          <UserTable title="Users" userList={normalUsers} />
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
