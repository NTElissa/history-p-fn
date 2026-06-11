import { useState, useEffect } from 'react';
import { adminFetchBookings, adminUpdateBooking, adminDeleteBooking } from '../../api';
import { CheckCircle, XCircle, Trash2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      const { data } = await adminFetchBookings();
      setBookings(Array.isArray(data) ? data : data?.data || []);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBookings(); }, []);

  const handleStatus = async (id, status) => {
    try {
      await adminUpdateBooking(id, { status });
      toast.success(`Booking ${status}`);
      loadBookings();
    } catch {
      toast.error('Failed to update booking');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this booking?')) return;
    try {
      await adminDeleteBooking(id);
      toast.success('Booking deleted');
      setBookings(prev => prev.filter(b => b._id !== id));
    } catch {
      toast.error('Failed to delete booking');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tour Bookings</h1>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
          <Clock size={48} className="mx-auto mb-3 opacity-50" />
          <p>No bookings yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Visitor</th>
                  <th className="px-4 py-3 text-left">Guide</th>
                  <th className="px-4 py-3 text-left">Date & Time</th>
                  <th className="px-4 py-3 text-left">Group</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map(b => (
                  <tr key={b._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-800">{b.visitorName}</p>
                        <p className="text-xs text-gray-500">{b.visitorEmail}</p>
                        {b.visitorPhone && <p className="text-xs text-gray-400">{b.visitorPhone}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{b.guideId?.name || 'Unknown'}</td>
                    <td className="px-4 py-3">
                      <p className="text-gray-800">{new Date(b.date).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">{b.time}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{b.groupSize} people</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[b.status]}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {b.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatus(b._id, 'confirmed')}
                              className="p-1.5 rounded-lg text-green-600 hover:bg-green-50"
                              title="Confirm"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => handleStatus(b._id, 'rejected')}
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                              title="Reject"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(b._id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Messages from bookings */}
      {bookings.filter(b => b.message).length > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Special Requests</h2>
          <div className="space-y-3">
            {bookings.filter(b => b.message).map(b => (
              <div key={b._id} className="border border-gray-100 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-800">{b.visitorName}</p>
                <p className="text-sm text-gray-600 mt-1">{b.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
