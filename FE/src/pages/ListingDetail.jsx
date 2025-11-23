import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import AuthContext from '../context/AuthContext';
import ListingCard from '../components/ListingCard';
import toast from 'react-hot-toast';

const ListingDetail = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axiosInstance.get(`/listings/${id}`);
        setListing(res.data);
      } catch (error) {
        toast.error('Failed to fetch listing details');
      } finally {
        setLoading(false);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const res = await axiosInstance.get(`/listings/recommendations/${id}`);
        setRecommendations(res.data);
      } catch (error) {
        console.error('Failed to fetch recommendations');
      }
    };

    fetchListing();
    fetchRecommendations();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await axiosInstance.delete(`/listings/${id}`);
        toast.success('Listing deleted successfully');
        navigate('/');
      } catch (error) {
        toast.error('Failed to delete listing');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!listing) {
    return <div className="text-center mt-10">Listing not found</div>;
  }

  const images = listing.imageFileNames || [listing.imageFileName];
  const currentImage = `http://localhost:5000/uploads/${images[currentImageIndex]}`;
  const isOwner = user && listing.owner && user._id === listing.owner._id;
  const isLowStock = listing.availableRooms <= 3 && listing.availableRooms > 0;
  const isSoldOut = listing.availableRooms === 0;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Image Gallery */}
        <div className="relative">
          <img
            src={currentImage}
            alt={listing.title}
            className="w-full h-96 object-cover"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
              >
                ←
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
              >
                →
              </button>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
                {currentImageIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        <div className="p-8">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{listing.title}</h1>
              <p className="text-gray-600 mt-2 text-lg">{listing.location}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-teal-600">
                Rp {listing.price.toLocaleString('id-ID')}
                <span className="text-sm font-normal text-gray-500">/bulan</span>
              </p>
            </div>
          </div>

          {/* Room Availability Warning */}
          <div className="mt-4">
            {isSoldOut ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                ⚠️ Kamar sudah penuh. Tidak ada kamar tersedia saat ini.
              </div>
            ) : isLowStock ? (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                ⚠️ Segera booking! Hanya tersisa {listing.availableRooms} kamar dari {listing.totalRooms} kamar.
              </div>
            ) : (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                ✓ Tersedia {listing.availableRooms} dari {listing.totalRooms} kamar
              </div>
            )}
          </div>

          {/* Facilities */}
          {listing.facilities && listing.facilities.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Fasilitas</h2>
              <div className="flex flex-wrap gap-2">
                {listing.facilities.map((facility, index) => (
                  <span
                    key={index}
                    className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm"
                  >
                    {facility}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
          </div>

          <div className="mt-6 border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-800">Owner Info</h2>
            <p className="text-gray-600">Posted by: {listing.owner?.username}</p>
            <p className="text-gray-600">Email: {listing.owner?.email}</p>
          </div>

          {!isOwner && user && (
            <div className="mt-6">
              <Link
                to={`/chat/${listing._id}/${listing.owner._id}`}
                className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition font-semibold"
              >
                💬 Chat with Owner
              </Link>
            </div>
          )}

          {isOwner && (
            <div className="mt-8 flex space-x-4">
              <button
                onClick={() => alert('Edit functionality to be implemented')}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Rekomendasi Kos Lainnya</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((rec) => (
              <ListingCard key={rec._id} listing={rec} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingDetail;
