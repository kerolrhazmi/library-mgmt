import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowDate, setBorrowDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [message, setMessage] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchBook = async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();

      setLoading(false);

      if (error) {
        console.error('Error fetching book:', error.message);
      } else {
        setBook(data);
      }
    };

    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('ratings')
        .select('*, profiles(display_name)')
        .eq('book_id', Number(id))
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error.message);
      } else {
        setReviews(data);
      }
    };

    fetchBook();
    fetchReviews();
  }, [id]);

  const handleBorrow = async () => {
    setMessage('');
    if (!borrowDate || !returnDate) {
      setMessage('Please select both borrow and return dates.');
      return;
    }
    if (borrowDate > returnDate) {
      setMessage('Return date must be after borrow date.');
      return;
    }

    setSubmitLoading(true);

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage('You must be logged in to borrow books.');
      setSubmitLoading(false);
      return;
    }

    const { error } = await supabase.from('borrow_requests').insert([
      {
        user_id: user.id,
        book_id: book.id,
        borrow_date: borrowDate,
        return_date: returnDate,
        status: 'pending',
      },
    ]);

    if (error) {
      console.error('Insert error:', error);
      setMessage('Failed to submit borrow request.');
    } else {
      setMessage('Borrow request submitted successfully!');
      setBorrowDate('');
      setReturnDate('');
    }

    setSubmitLoading(false);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex text-yellow-500">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>{star <= rating ? '★' : '☆'}</span>
        ))}
      </div>
    );
  };

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
    <div className="min-h-screen flex flex-col items-center bg-gray-50 px-4 py-12 gap-12 mt-[70px]">
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

          <div className="mt-8 md:mt-auto flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="date"
                value={borrowDate}
                onChange={(e) => setBorrowDate(e.target.value)}
                className="border p-2 rounded w-full md:w-auto"
              />
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="border p-2 rounded w-full md:w-auto"
              />
            </div>

            <button
              className="bg-[#E41B1B] hover:bg-[#C41717] text-white py-3 px-8 rounded-md font-semibold transition"
              onClick={handleBorrow}
              disabled={submitLoading}
            >
              {submitLoading ? 'Submitting...' : 'Borrow'}
            </button>

            {message && <p className="text-center text-red-600">{message}</p>}
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">User Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500 italic">No reviews yet for this book</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="border-b pb-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">
                    {rev.profiles?.display_name || 'Anonymous'}
                  </span>
                  {renderStars(rev.rating)}
                </div>
                <p className="text-gray-700 mt-2">{rev.review_text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetail;
