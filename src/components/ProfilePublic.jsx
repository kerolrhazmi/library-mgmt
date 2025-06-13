import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
        .from('borrowed_books')
        .select('id, book_id, books(title, author)')
        .eq('user_id', id);

      if (!userError) setProfile(user);
      if (!booksError) setBorrowedBooks(books);

      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading...</div>;
  if (!profile) return <div className="p-10 text-center text-red-500">Profile not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 mt-[100px]">
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{profile.display_name}</h1>
        <p className="text-sm text-gray-500 mb-1">Role: <span className="text-indigo-500 font-medium">{profile.role}</span></p>
        <p className="text-sm text-gray-500">Phone: {profile.phone_number || 'Not provided'}</p>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 shadow">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">📚 Borrowed Books</h2>
        {borrowedBooks.length > 0 ? (
          <ul className="space-y-4">
            {borrowedBooks.map(entry => (
              <li key={entry.id} className="bg-white p-4 rounded-xl shadow flex flex-col">
                <span className="font-semibold text-lg text-gray-700">{entry.books.title}</span>
                <span className="text-sm text-gray-500">by {entry.books.author}</span>
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
