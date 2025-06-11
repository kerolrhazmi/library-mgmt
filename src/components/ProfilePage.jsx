import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { UserAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { session } = UserAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [extendDates, setExtendDates] = useState({});

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const fetchBorrowedBooks = async () => {
    const { data, error } = await supabase
      .from('borrow_requests')
      .select(`
        id,
        borrow_date,
        return_date,
        status,
        extend_requested,
        new_return_date,
        books (
          title,
          cover_url
        )
      `)
      .eq('user_id', session?.user.id)
      .order('borrow_date', { ascending: false });

    if (error) {
      console.error('Error fetching borrowed books:', error);
    } else {
      setRequests(data);
    }

    setLoading(false);
  };

  const requestExtension = async (id, newDate) => {
    const { error } = await supabase
      .from('borrow_requests')
      .update({
        extend_requested: true,
        new_return_date: newDate,
        status: 'pending'
      })
      .eq('id', id);

    if (!error) {
      alert('Extension request sent!');
      fetchBorrowedBooks();
    } else {
      console.error('Error requesting extension:', error);
    }
  };

  const handleDateChange = (id, date) => {
    setExtendDates(prev => ({ ...prev, [id]: date }));
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-24">
      <h1 className="text-3xl font-bold text-center mb-6">My Borrowed Books</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-center text-gray-600">You have no borrow history.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white shadow-md rounded-xl p-6 flex justify-between items-start"
            >
              {/* Left Side Content */}
              <div className="flex-1 pr-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {req.books?.title || 'Unknown Book'}
                </h2>
                <p>
                  <strong>Status:</strong>{' '}
                  <span
                    className={
                      req.status === 'approved'
                        ? 'text-green-600'
                        : req.status === 'rejected'
                        ? 'text-red-600'
                        : 'text-yellow-600'
                    }
                  >
                    {req.status}
                  </span>
                </p>
                <p><strong>Borrowed On:</strong> {req.borrow_date}</p>
                <p><strong>Return By:</strong> {req.return_date}</p>
                {req.extend_requested && req.new_return_date && (
                  <p><strong>Extension Requested Until:</strong> {req.new_return_date}</p>
                )}

                {!req.extend_requested && (
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2">
                    <input
                      type="date"
                      value={extendDates[req.id] || ''}
                      onChange={(e) => handleDateChange(req.id, e.target.value)}
                      className="border px-3 py-2 rounded-md"
                    />
                    <button
                      onClick={() => requestExtension(req.id, extendDates[req.id])}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                      disabled={!extendDates[req.id]}
                    >
                      Request Extension
                    </button>
                  </div>
                )}
              </div>

              {/* Right Side Book Cover */}
              {req.books?.cover_url && (
                <img
                  src={req.books.cover_url}
                  alt={req.books.title}
                  className="w-24 h-32 object-cover rounded-lg shadow-md"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
