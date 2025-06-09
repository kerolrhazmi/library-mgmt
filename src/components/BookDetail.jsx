import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      const { data, error } = await supabase.from('books').select('*').eq('id', id).single();
      setLoading(false);
      if (error) {
        console.error('Error fetching book:', error.message);
      } else {
        setBook(data);
      }
    };
    fetchBook();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading...
      </div>
    );

  if (!book)
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-500 font-semibold">
        Book not found.
      </div>
    );

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4 py-12">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8 flex flex-col md:flex-row gap-8">
        <img
          src={book.cover_url || 'https://via.placeholder.com/200x300?text=No+Cover'}
          alt={book.title}
          className="w-full md:w-64 h-auto md:h-96 object-cover rounded-md shadow-md"
        />

        <div className="flex flex-col justify-between flex-1">
          <div>
            <h1 className="text-4xl font-extrabold mb-4 text-center md:text-left text-gray-900">
              {book.title}
            </h1>
            <p className="text-lg text-gray-700 mb-1 text-center md:text-left">
              <span className="font-semibold">Author:</span> {book.author}
            </p>
            <p className="text-md italic text-gray-500 mb-6 text-center md:text-left">
              Genre: {book.genre}
            </p>
            <p className="text-gray-600 leading-relaxed text-justify md:text-left">
              {book.description || 'No description available.'}
            </p>
          </div>

          <button
            className="mt-8 md:mt-auto bg-[#E41B1B] hover:bg-[#C41717] text-white py-3 px-8 rounded-md font-semibold transition self-center md:self-start"
            type="button"
          >
            Borrow
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
