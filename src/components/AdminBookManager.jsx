import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AdminBookManager = () => {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    published_year: '',
    cover_url: '',
    description: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch books
  const fetchBooks = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('books').select('*').order('title');
    if (error) {
      setError('Failed to fetch books');
    } else {
      setBooks(data);
      setError('');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      genre: '',
      published_year: '',
      cover_url: '',
      description: '',
    });
    setEditingId(null);
    setError('');
  };

  // Add or update book
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.author) {
      setError('Title and Author are required');
      return;
    }

    setLoading(true);

    if (editingId) {
      const { error } = await supabase
        .from('books')
        .update({
          title: formData.title,
          author: formData.author,
          genre: formData.genre,
          published_year: formData.published_year ? parseInt(formData.published_year) : null,
          cover_url: formData.cover_url || null,
          description: formData.description || null,
        })
        .eq('id', editingId);

      if (error) {
        setError('Failed to update book');
      } else {
        resetForm();
      }
    } else {
      const { error } = await supabase.from('books').insert([
        {
          title: formData.title,
          author: formData.author,
          genre: formData.genre,
          published_year: formData.published_year ? parseInt(formData.published_year) : null,
          cover_url: formData.cover_url || null,
          description: formData.description || null,
        },
      ]);

      if (error) {
        setError('Failed to add book');
      } else {
        resetForm();
      }
    }

    fetchBooks();
    setLoading(false);
  };

  // Delete book
  const handleDeleteBook = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    setLoading(true);
    const { error } = await supabase.from('books').delete().eq('id', id);
    if (error) {
      setError('Failed to delete book');
    } else {
      fetchBooks();
    }
    setLoading(false);
  };

  // Load book data into form for editing
  const handleEditBook = (book) => {
    setFormData({
      title: book.title || '',
      author: book.author || '',
      genre: book.genre || '',
      published_year: book.published_year || '',
      cover_url: book.cover_url || '',
      description: book.description || '',
    });
    setEditingId(book.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-[90px]">
      <h2 className="text-3xl font-extrabold mb-6 text-gray-800 border-b border-gray-300 pb-2">
        {editingId ? 'Edit Book' : 'Add New Book'}
      </h2>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="title"
            placeholder="Title *"
            value={formData.title}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
          <input
            type="text"
            name="author"
            placeholder="Author *"
            value={formData.author}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
          <input
            type="text"
            name="genre"
            placeholder="Genre"
            value={formData.genre}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="number"
            name="published_year"
            placeholder="Published Year"
            value={formData.published_year}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            min="0"
          />
          <input
            type="text"
            name="cover_url"
            placeholder="Cover Image URL"
            value={formData.cover_url}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-3 col-span-full focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <textarea
            name="description"
            placeholder="Book Description"
            value={formData.description}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-3 col-span-full resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
            rows={4}
          />
        </div>

        <div className="flex items-center gap-4 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {editingId ? 'Update Book' : 'Add Book'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
        {error && <p className="text-red-600 mt-4 font-medium">{error}</p>}
      </form>

      <h3 className="text-2xl font-bold mb-4 text-gray-700">Existing Books</h3>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : books.length === 0 ? (
        <p className="text-center text-gray-500">No books found.</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2">
          {books.map((book) => (
            <li
              key={book.id}
              className="bg-white shadow rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4">
                {book.cover_url ? (
                  <img
                    src={book.cover_url}
                    alt={book.title}
                    className="w-16 h-24 object-cover rounded-md flex-shrink-0 border border-gray-300"
                  />
                ) : (
                  <div className="w-16 h-24 bg-gray-200 flex items-center justify-center rounded-md border border-gray-300 text-gray-400 text-sm select-none">
                    No Image
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-lg text-gray-800">{book.title}</h4>
                  <p className="text-gray-600">by {book.author}</p>
                  <p className="text-sm text-gray-500">
                    {book.genre || 'Genre N/A'} • {book.published_year || 'Year N/A'}
                  </p>
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex gap-3">
                <button
                  onClick={() => handleEditBook(book)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-5 rounded-md font-semibold transition-colors"
                  aria-label={`Edit ${book.title}`}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteBook(book.id)}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-5 rounded-md font-semibold transition-colors"
                  aria-label={`Delete ${book.title}`}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminBookManager;
