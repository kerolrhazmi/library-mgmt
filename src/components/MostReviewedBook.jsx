import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const MostReviewedBook = () => {
  const [topBooks, setTopBooks] = useState([]);

  useEffect(() => {
    const fetchTopRatedBooks = async () => {
      // Step 1: Fetch all ratings
      const { data: ratings, error: ratingsError } = await supabase
        .from('ratings')
        .select('book_id, rating');

      if (ratingsError) {
        console.error('Error fetching ratings:', ratingsError);
        return;
      }

      // Step 2: Calculate average ratings
      const ratingMap = {};

      ratings.forEach(({ book_id, rating }) => {
        if (!ratingMap[book_id]) {
          ratingMap[book_id] = { total: 0, count: 0 };
        }
        ratingMap[book_id].total += rating;
        ratingMap[book_id].count += 1;
      });

      const averages = Object.entries(ratingMap)
        .map(([id, { total, count }]) => ({
          id,
          average: total / count,
          count,
        }))
        .sort((a, b) => b.average - a.average)
        .slice(0, 4);

      // Step 3: Fetch book details
      const { data: booksData, error: booksError } = await supabase
        .from('books')
        .select('id, title, cover_url')
        .in('id', averages.map(b => b.id));

      if (booksError) {
        console.error('Error fetching books:', booksError);
        return;
      }

      // Step 4: Merge data safely
      const finalBooks = averages.map(avg => {
        const match = booksData.find(b => String(b.id) === String(avg.id));
        return { ...avg, ...match };
      });

      setTopBooks(finalBooks);
    };

    fetchTopRatedBooks();
  }, []);

  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-[32px] font-extrabold text-center text-gray-900 mb-12 playfair-display-gg">
          Popular Picks
        </h2>

        <div className="flex flex-wrap justify-center gap-8">
          {topBooks.map((book, index) => (
            <Link
              key={book.id}
              to={`/book/${book.id}`}
              className="relative w-[240px] bg-white rounded-xl shadow-lg hover:shadow-xl transition-transform duration-300 group"
            >
              {/* Rank badge */}
              <div className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full flex items-center justify-center bg-yellow-400 text-white text-sm font-bold shadow ring-2 ring-yellow-300">
                #{index + 1}
              </div>

              <div className="p-4">
                <div className="w-full h-[260px] rounded-md flex items-center justify-center overflow-hidden border bg-white">
                  <img
                    src={book.cover_url || 'https://via.placeholder.com/150x220?text=No+Cover'}
                    alt={book.title}
                    className="object-contain h-full transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="mt-4 text-center">
                  <h3 className="text-md font-semibold text-gray-800 mb-1 leading-snug line-clamp-2">
                    {book.title}
                  </h3>
                  <div className="flex items-center justify-center gap-1 text-sm text-yellow-600 font-medium">
                    <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-500" />
                    {book.average.toFixed(1)} ({book.count} reviews)
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MostReviewedBook;
