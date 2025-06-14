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
    <div className="flex max-w-[1400px] mx-auto px-6 gap-8 py-12 mt-[100px]">
      {/* Left Sidebar */}
      <aside className="w-[18%] rounded-2xl bg-white shadow-lg p-6 h-fit sticky top-24 self-start">
        <form onSubmit={handleSearchSubmit} className="flex flex-col gap-4 mb-8">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search books..."
            className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <button
            type="submit"
            className="bg-red-500 text-white font-medium py-2 rounded-lg hover:bg-red-600 transition"
          >
            Search
          </button>
        </form>

        <div>
          <h3 className="font-semibold text-xl text-gray-800 mb-4">Genres</h3>
          <ul className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto text-sm text-gray-700">
            <li
              tabIndex={0}
              role="button"
              onClick={() => handleGenreClick('')}
              onKeyDown={(e) => e.key === 'Enter' && handleGenreClick('')}
              className={`cursor-pointer py-2 px-4 rounded-lg ${
                selectedGenre === ''
                  ? 'bg-red-100 text-red-600 font-semibold'
                  : 'hover:bg-red-50 hover:text-red-600'
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
                className={`cursor-pointer py-2 px-4 rounded-lg ${
                  selectedGenre === genre
                    ? 'bg-red-100 text-red-600 font-semibold'
                    : 'hover:bg-red-50 hover:text-red-600'
                }`}
              >
                {genre}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Right Content */}
      <main className="w-[82%]">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          {selectedGenre
            ? `Books in "${selectedGenre}" Genre`
            : searchTerm
            ? `Search Results for "${searchTerm}"`
            : 'All Books'}
        </h2>

        {loading && (
          <div className="text-gray-500 text-lg">Loading books...</div>
        )}
        {!loading && books.length === 0 && (
          <div className="text-gray-500 text-lg">No books found.</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {books.map(({ id, title, author, genre, cover_url }) => (
            <Link
              to={`/book/${id}`}
              key={id}
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 flex flex-col items-center"
            >
              <div className="bg-gray-100 w-full h-[270px] flex items-center justify-center overflow-hidden rounded-lg">
                <img
                  src={cover_url || 'https://via.placeholder.com/150x220?text=No+Cover'}
                  alt={title}
                  className="object-contain h-full group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="text-center mt-4 space-y-1">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-700">By {author}</p>
                <p className="text-xs text-gray-500 italic">{genre}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SearchResults;
