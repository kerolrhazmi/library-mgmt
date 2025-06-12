import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Hero2 = ({ refProp }) => {
  const [originalBooks, setOriginalBooks] = useState([]);
  const [books, setBooks] = useState([]);
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const autoScrollInterval = useRef(null);
  const resumeTimeout = useRef(null);
  const cardWidth = 260;
  const cardsToScroll = 3;

  useEffect(() => {
    async function fetchBooks() {
      const { data, error } = await supabase
        .from('books')
        .select('id, title, cover_url');

      if (error) {
        console.error('Error fetching books:', error.message);
      } else {
        setOriginalBooks(data);
        setBooks(data.concat(data)); // initial 2 loops
      }
    }

    fetchBooks();
  }, []);

  const startAutoScroll = () => {
    stopAutoScroll(); // clear existing interval
    const container = scrollRef.current;
    if (!container) return;

    autoScrollInterval.current = setInterval(() => {
      container.scrollLeft += 1.5; // faster scroll

      if (
        container.scrollLeft + container.offsetWidth >=
        container.scrollWidth - cardWidth * cardsToScroll
      ) {
        setBooks((prev) => [...prev, ...originalBooks]);
      }
    }, 16); // ~60fps
  };

  const stopAutoScroll = () => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
      autoScrollInterval.current = null;
    }
  };

  const pauseAndResumeAutoScroll = () => {
    stopAutoScroll();
    clearTimeout(resumeTimeout.current);
    resumeTimeout.current = setTimeout(() => {
      startAutoScroll();
    }, 2000); // restart after 2s
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    startAutoScroll();

    container.addEventListener('mouseenter', stopAutoScroll);
    container.addEventListener('mouseleave', startAutoScroll);

    return () => {
      stopAutoScroll();
      clearTimeout(resumeTimeout.current);
      container.removeEventListener('mouseenter', stopAutoScroll);
      container.removeEventListener('mouseleave', startAutoScroll);
    };
  }, [books, originalBooks]);

  const handleScroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    pauseAndResumeAutoScroll(); // pause on manual scroll

    const scrollAmount = cardWidth * cardsToScroll;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });

    if (
      container.scrollLeft + container.offsetWidth >=
      container.scrollWidth - scrollAmount
    ) {
      setBooks((prev) => [...prev, ...originalBooks]);
    }
  };

  return (
    <div ref={refProp} className="py-12 relative bg-[#F9F9F9]">
      <h1 className="text-[30px] playfair-display-gg font-extrabold text-[#000000] text-center mb-10">
        Books Catalogue
      </h1>

      <div className="relative max-w-6xl mx-auto px-8">
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
          aria-label="Scroll left"
        >
          <ChevronLeft size={26} />
        </button>

        <button
          onClick={() => handleScroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
          aria-label="Scroll right"
        >
          <ChevronRight size={26} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto px-6 py-4 hide-scrollbar"
          style={{
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {books.map((book, index) => (
            <div
              key={`${book.id}-${index}`}
              onClick={() => navigate(`/book/${book.id}`)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') navigate(`/book/${book.id}`);
              }}
              role="button"
              aria-label={`View details for ${book.title}`}
              className="min-w-[240px] max-w-[240px] flex-shrink-0 bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 cursor-pointer group"
            >
              <div className="flex flex-col items-center p-4">
                <img
                  src={book.cover_url || 'https://via.placeholder.com/150x220?text=No+Cover'}
                  alt={book.title}
                  className="h-[260px] object-contain rounded-md mb-3 group-hover:scale-105 transition-transform duration-300"
                />
                <h3 className="text-md font-semibold text-center text-[#333]">{book.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Hero2;
