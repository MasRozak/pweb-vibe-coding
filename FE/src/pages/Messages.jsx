import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    try {
      console.log('Fetching conversations...');
      const res = await axiosInstance.get('/messages');
      console.log('Messages response:', res.data);
      setConversations(res.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      const errorMsg = error.response?.data?.message || 'Failed to fetch conversations';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Messages</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={fetchConversations}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Messages</h1>

      {conversations.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <p className="text-gray-600">No conversations yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {conversations.map((conv) => {
            const otherUser = conv._id.user;
            const listing = conv._id.listing;
            const imageUrl = listing?.imageFileNames?.[0]
              ? `http://localhost:5000/uploads/${listing.imageFileNames[0]}`
              : '';

            return (
              <Link
                key={`${conv._id.listing}-${conv._id.user}`}
                to={`/chat/${conv._id.listing}/${conv._id.user._id}`}
                className="block bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
              >
                <div className="flex items-center space-x-4">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={listing?.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">{otherUser?.username}</h3>
                        <p className="text-sm text-gray-600">{listing?.title}</p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1 truncate">{conv.lastMessage}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(conv.lastMessageDate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Messages;
