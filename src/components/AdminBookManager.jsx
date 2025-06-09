import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AdminBookManager = () => {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    published_year: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch books from Supabase
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

  // Handle form input changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Add a new book
  const handleAddBook = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.author) {
      setError('Title and Author are required');
      return;
    }

    setLoading(true);
    const { error } = await supabase.from('books').insert([
      {
        title: formData.title,
        author: formData.author,
        genre: formData.genre,
        published_year: formData.published_year ? parseInt(formData.published_year) : null,
        available: true,
      },
    ]);

    if (error) {
      setError('Failed to add book');
    } else {
      setFormData({ title: '', author: '', genre: '', published_year: '' });
      setError('');
      fetchBooks();
    }
    setLoading(false);
  };

  // Delete a book
  const handleDeleteBook = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    setLoading(true);
    const { error } = await supabase.from('books').delete().eq('id', id);

    if (error) {
      setError('Failed to delete book');
    } else {
      setError('');
      fetchBooks();
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 mt-[50px]">
      <h2 className="text-2xl font-semibold mb-4">Manage Books</h2>

      <form onSubmit={handleAddBook} className="mb-8 space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={formData.author}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="text"
          name="genre"
          placeholder="Genre"
          value={formData.genre}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          name="published_year"
          placeholder="Published Year"
          value={formData.published_year}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add Book
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>

      <h3 className="text-xl font-semibold mb-2">Existing Books</h3>
      {loading ? (
        <p>Loading...</p>
      ) : books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <ul>
          {books.map((book) => (
            <li
              key={book.id}
              className="flex justify-between border-b py-2 items-center"
            >
              <span>
                <strong>{book.title}</strong> by {book.author} ({book.published_year || 'N/A'})
              </span>
              <button
                onClick={() => handleDeleteBook(book.id)}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminBookManager;
