import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminFetchTrail, adminCreateTrail, adminUpdateTrail } from '../../api';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

const TrailForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ title: '', description: '', location: '', year: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      adminFetchTrail(id).then(({ data }) => {
        setForm({
          title: data.title || '', description: data.description || '',
          location: data.location || '', year: data.year || '',
        });
        if (data.imageUrl) {
          setPreview(`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${data.imageUrl}`);
        }
      }).catch(() => toast.error('Failed to load trail'));
    }
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => { if (val) formData.append(key, val); });
      if (image) formData.append('image', image);

      if (isEdit) {
        await adminUpdateTrail(id, formData);
        toast.success('Trail updated');
      } else {
        await adminCreateTrail(formData);
        toast.success('Trail created');
      }
      navigate('/admin/trails');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save trail');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => navigate('/admin/trails')} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
        <ArrowLeft size={20} /> Back to Trails
      </button>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? 'Edit' : 'New'} Trail</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input name="location" value={form.location} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input name="year" value={form.year} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
          <input type="file" accept="image/*" onChange={(e) => { setImage(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])); }} className="text-sm" />
          {preview && <img src={preview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg" />}
        </div>
        <button type="submit" disabled={loading}
          className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-2 rounded-lg transition disabled:opacity-50">
          {loading ? 'Saving...' : isEdit ? 'Update Trail' : 'Create Trail'}
        </button>
      </form>
    </div>
  );
};

export default TrailForm;
