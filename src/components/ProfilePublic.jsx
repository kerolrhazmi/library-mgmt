import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ProfilePublic = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: user, error: userError } = await supabase
        .from('profiles')
        .select('display_name, phone_number, role')
        .eq('id', id)
        .single();

      const { data: books, error: booksError } = await supabase
        .from('borrow_requests')
        .select('id, book_id, status, borrow_date, return_date, books(title, author, cover_url)')
        .eq('user_id', id);

      if (!userError) setProfile(user);
      if (!booksError) setBorrowedBooks(books);

      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading...</div>;
  if (!profile) return <div className="p-10 text-center text-red-500">Profile not found.</div>;

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString() : 'N/A';

  const getStatusBadge = (status) => {
    let color = 'gray';
    if (status === 'approved') color = 'green';
    else if (status === 'returned') color = 'blue';
    else if (status === 'overdue') color = 'red';

    return (
      <span
        className={`inline-block px-2 py-1 text-xs font-semibold rounded bg-${color}-100 text-${color}-700`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 mt-[100px]">
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{profile.display_name}</h1>
        <p className="text-sm text-gray-500 mb-1">
          Role: <span className="text-indigo-500 font-medium">{profile.role}</span>
        </p>
        <p className="text-sm text-gray-500">
          Phone: {profile.phone_number || 'Not provided'}
        </p>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 shadow">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">📚 Borrowed Books</h2>
        {borrowedBooks.length > 0 ? (
          <ul className="space-y-6">
            {borrowedBooks.map((entry) => (
              <li
                key={entry.id}
                className="flex items-start bg-white rounded-xl shadow p-4 gap-4"
              >
                {/* Book cover image */}
                <div className="w-20 h-28 rounded-md flex-shrink-0 overflow-hidden bg-gray-100 border">
                  {entry.books?.cover_url ? (
                    <img
                      src={entry.books.cover_url}
                      alt={`${entry.books.title} cover`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm bg-gray-200">
                      📖
                    </div>
                  )}
                </div>

                {/* Book info */}
                <div className="flex flex-col gap-1 flex-grow">
                  <span className="text-lg font-semibold text-gray-800">
                    {entry.books?.title || 'Untitled'}
                  </span>
                  <span className="text-sm text-gray-500">
                    by {entry.books?.author || 'Unknown Author'}
                  </span>

                  <div className="text-sm text-gray-600 mt-2">
                    <p>📅 Borrowed: {formatDate(entry.borrow_date)}</p>
                    <p>📆 Return Due: {formatDate(entry.return_date)}</p>
                    <div className="mt-1">{getStatusBadge(entry.status)}</div>
                  </div>

                  <Link
                    to={`/book/${entry.book_id}`}
                    className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
                  >
                    🔍 View Book
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No borrowed books.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePublic;
