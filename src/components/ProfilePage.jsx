import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { UserAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { session } = UserAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [extendDates, setExtendDates] = useState({});
  const [showReviewForm, setShowReviewForm] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 0, review_text: '' });
  const [reviewedBookIds, setReviewedBookIds] = useState(new Set());

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const fetchBorrowedBooks = async () => {
    setLoading(true);

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
          id,
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
      checkReviewedBooks(data.map((req) => req.books?.id));
    }

    setLoading(false);
  };

  const checkReviewedBooks = async (bookIds) => {
    const { data, error } = await supabase
      .from('ratings')
      .select('book_id')
      .in('book_id', bookIds)
      .eq('user_id', session?.user.id);

    if (!error && data) {
      const reviewedSet = new Set(data.map((r) => r.book_id));
      setReviewedBookIds(reviewedSet);
    }
  };

  const requestExtension = async (id, newDate) => {
    const { error } = await supabase
      .from('borrow_requests')
      .update({
        extend_requested: true,
        new_return_date: newDate,
        status: 'pending',
      })
      .eq('id', id);

    if (!error) {
      alert('Extension request sent!');
      fetchBorrowedBooks();
    } else {
      console.error('Error requesting extension:', error);
    }
  };

  const submitReview = async (book_id) => {
    const { error } = await supabase.from('ratings').insert({
      user_id: session?.user.id,
      book_id,
      rating: reviewData.rating,
      review_text: reviewData.review_text,
    });

    if (!error) {
      alert('Review submitted!');
      setShowReviewForm(null);
      setReviewData({ rating: 0, review_text: '' });
      fetchBorrowedBooks(); // Refresh the reviewed book list
    } else {
      console.error('Error submitting review:', error);
    }
  };

  const handleDateChange = (id, date) => {
    setExtendDates((prev) => ({ ...prev, [id]: date }));
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-5xl mx-auto p-6 mt-24">
      <h1 className="text-3xl font-bold text-center mb-6">My Borrowed Books</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-center text-gray-600">You have no borrow history.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const canReview =
              req.status === 'approved' &&
              today > req.return_date &&
              !reviewedBookIds.has(req.books?.id);

            return (
              <div
                key={req.id}
                className="bg-white shadow-md rounded-xl p-6 flex justify-between items-start relative"
              >
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

                  {canReview && (
                    <button
                      className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      onClick={() => setShowReviewForm(req.id)}
                    >
                      Leave a Review
                    </button>
                  )}
                  {!canReview && reviewedBookIds.has(req.books?.id) && (
                    <p className="mt-4 text-sm italic text-gray-500">Review already submitted.</p>
                  )}
                </div>

                {req.books?.cover_url && (
                  <img
                    src={req.books.cover_url}
                    alt={req.books.title}
                    className="w-24 h-32 object-cover rounded-lg shadow-md"
                  />
                )}

                {showReviewForm === req.id && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
                      <h3 className="text-lg font-semibold mb-4">Leave a Review</h3>
                      <label className="block mb-2 font-medium">Rating (1-5):</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={reviewData.rating}
                        onChange={(e) =>
                          setReviewData({ ...reviewData, rating: parseInt(e.target.value) })
                        }
                        className="w-20 border px-2 py-1 rounded"
                      />
                      <label className="block mt-4 mb-2 font-medium">Review:</label>
                      <textarea
                        value={reviewData.review_text}
                        onChange={(e) =>
                          setReviewData({ ...reviewData, review_text: e.target.value })
                        }
                        className="w-full border px-3 py-2 rounded"
                      ></textarea>
                      <div className="mt-4 flex justify-end gap-2">
                        <button
                          onClick={() => submitReview(req.books.id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Submit
                        </button>
                        <button
                          onClick={() => setShowReviewForm(null)}
                          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
