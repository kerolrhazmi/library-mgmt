import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AdminApproval = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('borrow_requests')
      .select(`
        *
        `)
      

    if (error) {
      console.error('Error fetching requests:', error);
    } else {
      setRequests(data);
    }

    setLoading(false);
  };

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('borrow_requests')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
    } else {
      fetchRequests(); // Refresh list
    }
  };

  if (loading) return <div className="text-center mt-20">Loading borrow requests...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 mt-24">
      <h1 className="text-3xl font-bold mb-6 text-center">Borrow Requests</h1>

      {requests.length === 0 ? (
        <p className="text-gray-600 text-center">No borrow requests found.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white shadow-md rounded-xl p-6 flex justify-between items-center"
            >
              <div>
                <p><span className="font-bold">Book:</span> {req.book?.title || 'N/A'}</p>
                <p><span className="font-bold">User ID:</span> {req.user_id}</p>
                <p><span className="font-bold">Return by:</span> {req.return_date}</p>
                <p>
                  <span className="font-bold">Status:</span>{' '}
                  <span
                    className={`font-semibold ${
                      req.status === 'approved'
                        ? 'text-green-600'
                        : req.status === 'rejected'
                        ? 'text-red-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    {req.status}
                  </span>
                </p>
              </div>

              {req.status === 'pending' && (
                <div className="space-x-2">
                  <button
                    onClick={() => updateStatus(req.id, 'approved')}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(req.id, 'rejected')}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminApproval;
