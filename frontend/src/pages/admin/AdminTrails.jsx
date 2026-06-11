import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminFetchTrails, adminDeleteTrail } from '../../api';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminTrails = () => {
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTrails = async () => {
    try {
      const { data } = await adminFetchTrails();
      setTrails(data);
    } catch (err) {
      toast.error('Failed to load trails');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTrails(); }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await adminDeleteTrail(id);
      toast.success('Trail deleted');
      loadTrails();
    } catch (err) {
      toast.error('Failed to delete trail');
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Trails</h1>
        <Link
          to="/admin/trails/new"
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition font-medium"
        >
          <Plus size={20} /> Add Trail
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Title</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Location</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Year</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Description</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {trails.map((trail) => (
              <tr key={trail._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-800">{trail.title}</td>
                <td className="px-6 py-4 text-gray-600">{trail.location}</td>
                <td className="px-6 py-4 text-gray-600">{trail.year}</td>
                <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{trail.description}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/trails/edit/${trail._id}`}
                      className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(trail._id, trail.title)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {trails.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  No trails found. Add your first trail!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTrails;
