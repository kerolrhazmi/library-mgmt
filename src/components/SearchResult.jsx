import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResults = () => {
  const query = useQuery().get('query') || '';
  const genreFilter = useQuery().get('genre') || '';

  const [searchTerm, setSearchTerm] = useState(query);
  const [selectedGenre, setSelectedGenre] = useState(genreFilter);
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchGenres() {
      const { data, error } = await supabase.from('books').select('genre');
      if (error) {
        console.error('Error fetching genres:', error);
        setGenres([]);
      } else {
        const uniqueGenres = Array.from(new Set(data?.map((b) => b.genre).filter(Boolean)));
        setGenres(uniqueGenres);
      }
    }
    fetchGenres();
  }, []);

  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      let queryBuilder = supabase.from('books').select('id, title, author, genre, cover_url');

      if (searchTerm && selectedGenre) {
        queryBuilder = queryBuilder
          .or(`title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%`)
          .eq('genre', selectedGenre);
      } else if (searchTerm) {
        queryBuilder = queryBuilder.or(
          `title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%,genre.ilike.%${searchTerm}%`
        );
      } else if (selectedGenre) {
        queryBuilder = queryBuilder.eq('genre', selectedGenre);
      }

      queryBuilder = queryBuilder.order('title', { ascending: true });

      const { data, error } = await queryBuilder;
      setLoading(false);

      if (error) {
        alert('Error fetching books: ' + error.message);
        setBooks([]);
      } else {
        setBooks(data || []);
      }
    }

    fetchBooks();
  }, [searchTerm, selectedGenre]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSelectedGenre('');
    navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
  };

  const handleGenreClick = (genre) => {
    if (!genre) {
      setSelectedGenre('');
      setSearchTerm('');
      navigate('/search');
      return;
    }
    setSelectedGenre(genre);
    setSearchTerm('');
    navigate(`/search?genre=${encodeURIComponent(genre)}`);
  };

  return (
    <div className="flex max-w-[1400px] mx-auto px-6 gap-8 py-[50px]">
      {/* Left Sidebar */}
      <aside className="w-[15%]  rounded-xl p-5 text-black h-fit sticky top-20 self-start pt-[80px]">
        <form onSubmit={handleSearchSubmit} className="flex flex-col gap-4 mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search books..."
            className="px-3 py-2 rounded-md border  border-white text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            type="submit"
            className="bg-white text-[#E41B1B] font-semibold py-2 rounded-md hover:bg-gray-200 transition"
          >
            Search
          </button>
        </form>

        <div>
          <h3 className="font-semibold text-lg mb-3">Genres</h3>
          <ul className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
            <li
              tabIndex={0}
              role="button"
              onClick={() => handleGenreClick('')}
              onKeyDown={(e) => e.key === 'Enter' && handleGenreClick('')}
              className={`cursor-pointer py-1 px-3 rounded ${
                selectedGenre === '' ? 'bg-white text-[#E41B1B]' : 'hover:bg-white hover:text-[#E41B1B]'
              }`}
            >
              All
            </li>
            {genres.map((genre) => (
              <li
                key={genre}
                tabIndex={0}
                role="button"
                onClick={() => handleGenreClick(genre)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenreClick(genre)}
                className={`cursor-pointer py-1 px-3 rounded ${
                  selectedGenre === genre
                    ? 'bg-white text-[#E41B1B]'
                    : 'hover:bg-white hover:text-[#E41B1B]'
                }`}
              >
                {genre}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Right Content */}
      <main className="w-[75%]">
        <h2 className="text-3xl font-semibold mb-6">
          {selectedGenre
            ? `Books in "${selectedGenre}" Genre`
            : searchTerm
            ? `Search Results for "${searchTerm}"`
            : 'All Books'}
        </h2>

        {loading && <p>Loading books...</p>}
        {!loading && books.length === 0 && <p>No books found.</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {books.map(({ id, title, author, genre, cover_url }) => (
            <Link
              to={`/book/${id}`}
              key={id}
              className="flex flex-col items-center bg-white rounded shadow-md hover:shadow-lg transition cursor-pointer p-4"
            >
              <div className="bg-[#EEEEEE] w-60 h-[270px] flex items-center justify-center p-8">
                <img
                  src={cover_url || 'https://via.placeholder.com/150x220?text=No+Cover'}
                  alt={title}
                  className="object-contain max-h-full"
                />
              </div>
              <div className="text-center mt-3">
                <h3 className="text-xl font-bold mb-1">{title}</h3>
                <p className="text-gray-700">By {author}</p>
                <p className="text-gray-600 italic">{genre}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SearchResults;
