import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminFetchGuide, adminCreateGuide, adminUpdateGuide } from '../../api';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

const GuideForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ name: '', bio: '', languages: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      adminFetchGuide(id).then(({ data }) => {
        setForm({
          name: data.name || '', bio: data.bio || '',
          languages: data.languages?.join(', ') || '',
        });
        if (data.imageUrl) {
          setPreview(`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${data.imageUrl}`);
        }
      }).catch(() => toast.error('Failed to load guide'));
    }
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('bio', form.bio);
      formData.append('languages', form.languages);
      if (image) formData.append('image', image);

      if (isEdit) {
        await adminUpdateGuide(id, formData);
        toast.success('Guide updated');
      } else {
        await adminCreateGuide(formData);
        toast.success('Guide created');
      }
      navigate('/admin/guides');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save guide');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => navigate('/admin/guides')} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
        <ArrowLeft size={20} /> Back to Guides
      </button>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? 'Edit' : 'New'} Guide</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input name="name" value={form.name} onChange={handleChange} required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea name="bio" value={form.bio} onChange={handleChange} rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Languages (comma-separated)</label>
          <input name="languages" value={form.languages} onChange={handleChange}
            placeholder="English, French, Kinyarwanda"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
          <input type="file" accept="image/*" onChange={(e) => { setImage(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])); }} className="text-sm" />
          {preview && <img src={preview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-full" />}
        </div>
        <button type="submit" disabled={loading}
          className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-2 rounded-lg transition disabled:opacity-50">
          {loading ? 'Saving...' : isEdit ? 'Update Guide' : 'Create Guide'}
        </button>
      </form>
    </div>
  );
};

export default GuideForm;
