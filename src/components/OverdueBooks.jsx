import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const OverdueBooks = () => {
  const [overdue, setOverdue] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('borrow_requests')
        .select('*, books(*), profiles(display_name)')
        .eq('status', 'approved')
        .lt('return_date', today);

      if (error) {
        console.error('Error fetching:', error);
        return;
      }

      setOverdue(data || []);
    };

    fetchBooks();
  }, []);

  const handleMarkReturned = async (id) => {
    const { error } = await supabase
      .from('borrow_requests')
      .update({ status: 'returned' })
      .eq('id', id);

    if (error) {
      console.error('Failed to update status:', error);
      return;
    }

    // Remove from overdue list
    setOverdue(prev => prev.filter(req => req.id !== id));
  };

  const renderTable = (list) => (
    <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 mb-10">
      <table className="min-w-full bg-white text-sm text-gray-800">
        <thead className="bg-red-600 text-white text-left uppercase text-xs">
          <tr>
            <th className="p-4">User</th>
            <th className="p-4">Book</th>
            <th className="p-4">Borrowed On</th>
            <th className="p-4">Return By</th>
            <th className="p-4">Days Overdue</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map((req, index) => {
            const daysLate = Math.floor(
              (new Date() - new Date(req.return_date)) / (1000 * 60 * 60 * 24)
            );

            return (
              <tr
                key={req.id}
                className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-red-50 transition`}
              >
                <td className="p-4 font-semibold">{req.profiles?.display_name}</td>
                <td className="p-4">{req.books?.title}</td>
                <td className="p-4">{req.borrow_date}</td>
                <td className="p-4">{req.return_date}</td>
                <td className="p-4 text-red-600 font-bold">{daysLate} days</td>
                <td className="p-4">
                  <button
                    onClick={() => handleMarkReturned(req.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 text-xs font-semibold"
                  >
                    Mark Returned
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-8 mt-24">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
         Overdue Books
      </h2>

      {overdue.length === 0 ? (
        <p className="text-center text-green-600 font-medium text-lg mb-10">
          No overdue books 🎉
        </p>
      ) : (
        <>
          <h3 className="text-xl font-bold mb-2 text-gray-700">Books Not Yet Returned</h3>
          {renderTable(overdue)}
        </>
      )}
    </div>
  );
};

export default OverdueBooks;