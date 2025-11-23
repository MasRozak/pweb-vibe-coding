import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';

const CreateListing = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [availableRooms, setAvailableRooms] = useState('1');
  const [totalRooms, setTotalRooms] = useState('1');
  const [facilities, setFacilities] = useState({
    wifi: false,
    ac: false,
    parking: false,
    laundry: false,
    kitchen: false,
    bathroom: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error('Maksimal 5 foto');
      return;
    }
    setImages(files);
  };

  const handleFacilityChange = (facility) => {
    setFacilities(prev => ({ ...prev, [facility]: !prev[facility] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!images || images.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    if (parseInt(availableRooms) > parseInt(totalRooms)) {
      toast.error('Kamar tersedia tidak boleh lebih dari total kamar');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('location', location);
    formData.append('description', description);
    formData.append('availableRooms', availableRooms);
    formData.append('totalRooms', totalRooms);
    
    const selectedFacilities = Object.keys(facilities).filter(key => facilities[key]);
    formData.append('facilities', JSON.stringify(selectedFacilities));
    
    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      await axiosInstance.post('/listings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Listing created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Create New Listing</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Title</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Price (Rp/bulan)</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Location</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Total Kamar</label>
            <input
              type="number"
              min="1"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={totalRooms}
              onChange={(e) => setTotalRooms(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Kamar Tersedia</label>
            <input
              type="number"
              min="0"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={availableRooms}
              onChange={(e) => setAvailableRooms(e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Fasilitas</label>
          <div className="grid grid-cols-2 gap-3">
            {Object.keys(facilities).map((facility) => (
              <label key={facility} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={facilities[facility]}
                  onChange={() => handleFacilityChange(facility)}
                  className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <span className="text-gray-700 capitalize">{facility}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Description</label>
          <textarea
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 h-32"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Images (Max 5)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesChange}
            className="w-full text-gray-700"
            required
          />
          {images.length > 0 && (
            <p className="text-sm text-gray-600 mt-2">{images.length} foto dipilih</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 text-white py-3 rounded-md hover:bg-teal-700 transition disabled:bg-teal-300 font-semibold"
        >
          {loading ? 'Creating...' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
};

export default CreateListing;
