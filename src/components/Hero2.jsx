import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const Hero2 = ({ refProp }) => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBooks() {
      const { data, error } = await supabase
        .from('books')
        .select('id, title, cover_url')
        .limit(6);

      if (error) {
        console.error('Error fetching books:', error.message);
      } else {
        setBooks(data);
      }
    }

    fetchBooks();
  }, []);

  return (
    <div ref={refProp} className="py-10">
      <h1 className="text-[30px] playfair-display-gg font-extrabold text-[#000000] text-center mb-10">
        Books Catalogue
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 max-w-6xl mx-auto">
        {books.map((book) => (
          <div
            key={book.id}
            onClick={() => navigate(`/book/${book.id}`)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') navigate(`/books/${book.id}`);
            }}
            role="button"
            aria-label={`View details for ${book.title}`}
            className="bg-[#EEEEEE] rounded-lg shadow-md hover:shadow-lg transition duration-300 flex flex-col items-center p-6 cursor-pointer"
          >
            <img
              src={book.cover_url || 'https://via.placeholder.com/150x220?text=No+Cover'}
              alt={book.title}
              className="h-[220px] object-contain mb-4"
            />
            <h3 className="text-lg font-semibold text-center mb-2">{book.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hero2;
