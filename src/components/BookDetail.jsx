import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { CalendarDays, Star, User, Heart, CheckCircle } from 'lucide-react';

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowDate, setBorrowDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [sessionUserId, setSessionUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: bookData, error: bookError }, { data: reviewData, error: reviewError }] = await Promise.all([
        supabase.from('books').select('*').eq('id', id).single(),
        supabase
          .from('ratings')
          .select('*, profiles(display_name)')
          .eq('book_id', Number(id))
          .order('created_at', { ascending: false })
      ]);

      setBook(bookData);
      setReviews(reviewData || []);
      setLoading(false);

      if (bookError) console.error('Error fetching book:', bookError.message);
      if (reviewError) console.error('Error fetching reviews:', reviewError.message);
    };

    const fetchFavoriteStatus = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return;

      setSessionUserId(user.id);

      const { data, error: favError } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .eq('book_id', id)
        .single();

      if (data) setIsFavorited(true);
      if (favError && favError.code !== 'PGRST116') console.error('Favorite check error:', favError.message);
    };

    fetchData();
    fetchFavoriteStatus();
  }, [id]);

  const handleBorrow = async () => {
    setMessage('');
    if (!borrowDate || !returnDate) {
      setMessage('Please select both borrow and return dates.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    if (borrowDate < today) {
      setMessage('Borrow date cannot be in the past.');
      return;
    }

    if (returnDate < today) {
      setMessage('Return date cannot be in the past.');
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

    const { error } = await supabase.from('borrow_requests').insert([{
      user_id: user.id,
      book_id: book.id,
      borrow_date: borrowDate,
      return_date: returnDate,
      status: 'pending',
    }]);

    if (error) {
      console.error('Insert error:', error);
      setMessage('Failed to submit borrow request.');
    } else {
      setMessage('');
      setBorrowDate('');
      setReturnDate('');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    }

    setSubmitLoading(false);
  };

  const handleFavoriteToggle = async () => {
    if (!sessionUserId) {
      setMessage('You must be logged in to favorite books.');
      return;
    }

    if (isFavorited) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', sessionUserId)
        .eq('book_id', id);

      if (!error) setIsFavorited(false);
    } else {
      const { error } = await supabase.from('favorites').insert({
        user_id: sessionUserId,
        book_id: id,
      });

      if (!error) setIsFavorited(true);
    }
  };

  const renderStars = (rating) => (
    <div className="flex text-yellow-500 text-lg">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={18}
          fill={star <= rating ? '#FACC15' : 'none'}
          stroke="#FACC15"
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading...
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-500 font-semibold">
        Book not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 mt-[70px] relative">
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg shadow-md flex items-center gap-2">
            <CheckCircle className="text-green-600" size={20} />
            <span className="text-sm font-medium">Borrow request sent!</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-12">
        <div className="bg-white rounded-xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-start transition-all duration-300">
          <img
            src={book.cover_url || 'https://via.placeholder.com/200x300?text=No+Cover'}
            alt={book.title}
            className="w-full h-auto md:h-[500px] object-cover rounded-xl shadow-md"
          />
          <div className="flex flex-col justify-between gap-6">
            <div>
              <div className="flex justify-between items-start">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{book.title}</h1>
                <button
                  onClick={handleFavoriteToggle}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full transition ${
                    isFavorited ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  <Heart
                    size={20}
                    fill={isFavorited ? 'white' : 'none'}
                    stroke={isFavorited ? 'white' : 'currentColor'}
                  />
                  {isFavorited ? 'Favorited' : 'Add to Favorites'}
                </button>
              </div>
              <p className="text-lg text-gray-700">
                <span className="font-semibold">Author:</span> {book.author}
              </p>
              <p className="text-md italic text-gray-600 mt-1">
                Genre: {book.genre}
              </p>
              <p className="mt-4 text-gray-700 leading-relaxed text-justify">
                {book.description || 'No description available.'}
              </p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2 w-full">
                  <CalendarDays size={20} className="text-gray-500" />
                  <input
                    type="date"
                    value={borrowDate}
                    onChange={(e) => setBorrowDate(e.target.value)}
                    className="border rounded-md px-3 py-2 w-full"
                  />
                </div>
                <div className="flex items-center gap-2 w-full">
                  <CalendarDays size={20} className="text-gray-500" />
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="border rounded-md px-3 py-2 w-full"
                  />
                </div>
              </div>
              <button
                onClick={handleBorrow}
                disabled={submitLoading}
                className="bg-[#E41B1B] hover:bg-[#C41717] text-white py-3 px-6 rounded-lg font-semibold transition w-full"
              >
                {submitLoading ? 'Submitting...' : 'Request to Borrow'}
              </button>
              {message && <p className="text-center text-red-600">{message}</p>}
            </div>
          </div>
        </div>

        {/* Review Section */}
        <div className="bg-white rounded-xl shadow-md p-8 transition-all duration-300">
          <h2 className="text-2xl font-bold border-b-2 border-[#E41B1B] inline-block pb-2 mb-6">
            User Reviews
          </h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500 italic">No reviews yet for this book.</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((rev) => (
                <div key={rev.id} className="flex gap-4 items-start border-b pb-4">
                  <div className="flex-shrink-0">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-800">
                        {rev.profiles?.display_name || 'Anonymous'}
                      </span>
                      {renderStars(rev.rating)}
                    </div>
                    <p className="text-gray-700 mt-2">{rev.review_text}</p>
                    <p className="text-sm text-gray-500 italic mt-1">
                      Reviewed on{' '}
                      {new Date(rev.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
