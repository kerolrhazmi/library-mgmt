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
    <div className="max-w-3xl mx-auto p-4 mt-[50px]">
      <h2 className="text-2xl font-semibold mb-4">{editingId ? 'Edit Book' : 'Add Book'}</h2>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
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
        <input
          type="text"
          name="cover_url"
          placeholder="Cover Image URL"
          value={formData.cover_url}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <textarea
          name="description"
          placeholder="Book Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          rows={4}
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#E41B1B] text-white py-2 px-4 rounded hover:bg-red-700"
          >
            {editingId ? 'Update Book' : 'Add Book'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
            >
              Cancel Edit
            </button>
          )}
        </div>
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
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditBook(book)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteBook(book.id)}
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
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
