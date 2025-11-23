import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import ListingCard from '../components/ListingCard';
import toast from 'react-hot-toast';

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axiosInstance.get('/listings');
        setListings(res.data);
      } catch (error) {
        toast.error('Failed to fetch listings');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Latest Listings</h1>
      {listings.length === 0 ? (
        <p className="text-gray-600 text-center">No listings found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
