import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { UserAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { session } = UserAuth();

  const [activeTab, setActiveTab] = useState('borrowed'); // 'borrowed', 'favorites', or 'reviews'
  const [requests, setRequests] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [extendDates, setExtendDates] = useState({});
  const [showReviewForm, setShowReviewForm] = useState(null);
  const [editReviewId, setEditReviewId] = useState(null); // for editing reviews in "Your Reviews"
  const [reviewData, setReviewData] = useState({ rating: 0, review_text: '' });
  const [reviewedBookIds, setReviewedBookIds] = useState(new Set());

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (session?.user?.id) {
      fetchBorrowedBooks();
      fetchFavorites();
      fetchUserReviews();
    }
  }, [session]);

  const fetchBorrowedBooks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('borrow_requests')
      .select(`
        id,
        book_id,
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

    if (!error && data) {
      setRequests(data);
      checkReviewedBooks(data.map((req) => req.books?.id));
    } else {
      console.error('Error fetching borrowed books:', error);
    }

    setLoading(false);
  };

  const fetchFavorites = async () => {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        id,
        book_id,
        books (
          id,
          title,
          cover_url
        )
      `)
      .eq('user_id', session?.user.id);

    if (!error) {
      setFavorites(data);
    } else {
      console.error('Error fetching favorites:', error);
    }
  };

  const fetchUserReviews = async () => {
    const { data, error } = await supabase
      .from('ratings')
      .select(`
        id,
        book_id,
        rating,
        review_text,
        books (
          id,
          title,
          cover_url
        )
      `)
      .eq('user_id', session?.user.id)
      .order('id', { ascending: false });

    if (!error) {
      setReviews(data);
    } else {
      console.error('Error fetching user reviews:', error);
    }
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

  const cancelRequest = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return;
    
    const { error } = await supabase
      .from('borrow_requests')
      .delete()
      .eq('id', id);

    if (!error) {
      alert('Request cancelled successfully!');
      fetchBorrowedBooks();
    } else {
      console.error('Error cancelling request:', error);
      alert('Failed to cancel request. Please try again.');
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
      fetchBorrowedBooks();
      fetchUserReviews();
    } else {
      console.error('Error submitting review:', error);
    }
  };

  const updateReview = async (reviewId) => {
    const { error } = await supabase
      .from('ratings')
      .update({
        rating: reviewData.rating,
        review_text: reviewData.review_text,
      })
      .eq('id', reviewId);

    if (!error) {
      alert('Review updated!');
      setEditReviewId(null);
      setReviewData({ rating: 0, review_text: '' });
      fetchUserReviews();
    } else {
      console.error('Error updating review:', error);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    const { error } = await supabase.from('ratings').delete().eq('id', reviewId);

    if (!error) {
      alert('Review deleted!');
      fetchUserReviews();
    } else {
      console.error('Error deleting review:', error);
    }
  };

  const handleDateChange = (id, date) => {
    setExtendDates((prev) => ({ ...prev, [id]: date }));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 mt-20 space-y-8">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">My Profile</h1>

      {/* Tabs */}
      <div className="flex justify-center gap-6 mb-10">
        <button
          onClick={() => setActiveTab('borrowed')}
          className={`px-4 py-2 rounded font-medium ${
            activeTab === 'borrowed'
              ? 'bg-[#E41B1B] text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Borrowed Books
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-4 py-2 rounded font-medium ${
            activeTab === 'favorites'
              ? 'bg-[#E41B1B] text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Favorites
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 rounded font-medium ${
            activeTab === 'reviews'
              ? 'bg-[#E41B1B] text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Your Reviews
        </button>
      </div>

      {/* Borrowed Books Tab */}
      {activeTab === 'borrowed' && (
        <>
          {loading ? (
            <p className="text-center text-gray-600 text-lg">Loading your borrowed books...</p>
          ) : requests.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">You haven't borrowed any books yet.</p>
          ) : (
            <div className="space-y-6">
              {requests.map((req) => {
                const canReview =
                  req.status === 'approved' &&
                  today > req.return_date &&
                  !reviewedBookIds.has(req.books?.id);

                const canCancel = req.status === 'pending';

                return (
                  <div
                    key={req.id}
                    className="flex flex-col sm:flex-row bg-white shadow-lg rounded-xl overflow-hidden"
                  >
                    {/* Book Cover */}
                    <div className="w-full sm:w-48 h-64 sm:h-auto flex-shrink-0">
                      <img
                        src={req.books?.cover_url || 'https://via.placeholder.com/150x200'}
                        alt={req.books?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info + Actions */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                          {req.books?.title || 'Unknown Title'}
                        </h2>

                        <div className="flex flex-wrap gap-4 text-gray-700 text-sm mb-2">
                          <p>
                            <strong>Status:</strong>{' '}
                            <span
                              className={
                                req.status === 'approved'
                                  ? 'text-green-600 font-medium'
                                  : req.status === 'rejected'
                                  ? 'text-red-600 font-medium'
                                  : 'text-yellow-600 font-medium'
                              }
                            >
                              {req.status}
                            </span>
                          </p>
                          <p>
                            <strong>Borrowed On:</strong> {req.borrow_date}
                          </p>
                          <p>
                            <strong>Return By:</strong> {req.return_date}
                          </p>
                          {req.extend_requested && req.new_return_date && (
                            <p>
                              <strong>Extension Requested Until:</strong> {req.new_return_date}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Extension + Review + Cancel */}
                      <div className="mt-4 flex flex-wrap items-center gap-4">
                        {!req.extend_requested && req.status === 'approved' && (
                          <>
                            <input
                              type="date"
                              value={extendDates[req.id] || ''}
                              onChange={(e) => handleDateChange(req.id, e.target.value)}
                              className="border px-3 py-2 rounded-md"
                            />
                            <button
                              onClick={() => requestExtension(req.id, extendDates[req.id])}
                              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                              disabled={!extendDates[req.id]}
                            >
                              Request Extension
                            </button>
                          </>
                        )}

                        {canCancel && (
                          <button
                            onClick={() => cancelRequest(req.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                          >
                            Cancel Request
                          </button>
                        )}

                        {canReview && (
                          <button
                            className="bg-[#E41B1B] text-white px-4 py-2 rounded hover:bg-red-700"
                            onClick={() => setShowReviewForm(req.id)}
                          >
                            Leave a Review
                          </button>
                        )}

                        {!canReview && reviewedBookIds.has(req.books?.id) && (
                          <p className="text-sm italic text-gray-500">Review already submitted.</p>
                        )}
                      </div>
                    </div>

                    {/* Review Modal */}
                    {showReviewForm === req.id && (
                      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md">
                          <h3 className="text-lg font-semibold mb-4">Leave a Review</h3>

                          <label className="block mb-1 font-medium">Rating:</label>
                          <div className="flex mb-4">
                            {[1, 2, 3, 4, 5].map((num) => (
                              <button
                                key={num}
                                onClick={() => setReviewData({ ...reviewData, rating: num })}
                                className={`text-2xl ${
                                  reviewData.rating >= num ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              >
                                ★
                              </button>
                            ))}
                          </div>

                          <label className="block mb-2 font-medium">Review:</label>
                          <textarea
                            value={reviewData.review_text}
                            onChange={(e) =>
                              setReviewData({ ...reviewData, review_text: e.target.value })
                            }
                            className="w-full border px-3 py-2 rounded mb-4"
                            rows={4}
                          ></textarea>

                          <div className="flex justify-end gap-3">
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
        </>
      )}

      {/* Favorites Tab */}
      {activeTab === 'favorites' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.length === 0 ? (
            <p className="text-center text-gray-500 text-lg col-span-full">
              You haven't added any favorites yet.
            </p>
          ) : (
            favorites.map((fav) => (
              <div
                key={fav.book_id}
                className="bg-white shadow-md rounded-xl overflow-hidden flex flex-col"
              >
                <img
                  src={fav.books?.cover_url || 'https://via.placeholder.com/150x200'}
                  alt={fav.books?.title}
                  className="w-full h-60 object-cover"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">{fav.books?.title}</h3>
                  <Link
                    to={`/book/${fav.book_id}`}
                    className="mt-auto inline-block text-center bg-[#E41B1B] text-white px-4 py-2 rounded hover:bg-[#C41717] transition"
                  >
                    View Book
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Your Reviews Tab */}
      {activeTab === 'reviews' && (
        <>
          {reviews.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">You haven't left any reviews yet.</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="flex flex-col sm:flex-row bg-white shadow-lg rounded-xl overflow-hidden"
                >
                  {/* Book Cover */}
                  <div className="w-full sm:w-48 h-64 sm:h-auto flex-shrink-0">
                    <img
                      src={review.books?.cover_url || 'https://via.placeholder.com/150x200'}
                      alt={review.books?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Review Info */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                        {review.books?.title || 'Unknown Title'}
                      </h2>

                      {/* Rating Stars */}
                      <div className="mb-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <span
                            key={num}
                            className={`text-2xl ${
                              review.rating >= num ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>

                      {editReviewId === review.id ? (
                        <>
                          <textarea
                            rows={4}
                            value={reviewData.review_text}
                            onChange={(e) =>
                              setReviewData((prev) => ({ ...prev, review_text: e.target.value }))
                            }
                            className="w-full border px-3 py-2 rounded mb-4"
                          />
                          <div className="flex mb-4">
                            {[1, 2, 3, 4, 5].map((num) => (
                              <button
                                key={num}
                                onClick={() => setReviewData((prev) => ({ ...prev, rating: num }))}
                                className={`text-2xl ${
                                  reviewData.rating >= num ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => updateReview(review.id)}
                              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditReviewId(null);
                                setReviewData({ rating: 0, review_text: '' });
                              }}
                              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-gray-700 whitespace-pre-line">{review.review_text}</p>
                          <div className="mt-4 flex gap-3">
                            <button
                              onClick={() => {
                                setEditReviewId(review.id);
                                setReviewData({
                                  rating: review.rating,
                                  review_text: review.review_text,
                                });
                              }}
                              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteReview(review.id)}
                              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfilePage;