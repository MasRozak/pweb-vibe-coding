import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';

const Chat = () => {
  const { listingId, ownerId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [listingInfo, setListingInfo] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchMessages();
    fetchListingInfo();
    const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [listingId, ownerId]);

  const fetchListingInfo = async () => {
    try {
      const res = await axiosInstance.get(`/listings/${listingId}`);
      setListingInfo(res.data);
    } catch (error) {
      console.error('Failed to fetch listing info');
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axiosInstance.get(`/messages/${listingId}/${ownerId}`);
      setMessages(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch messages');
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const res = await axiosInstance.post('/messages', {
        receiver: ownerId,
        listing: listingId,
        message: newMessage,
      });
      setMessages([...messages, res.data]);
      setNewMessage('');
      toast.success('Message sent!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {listingInfo && (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-4">
            {listingInfo.imageFileNames && listingInfo.imageFileNames[0] && (
              <img
                src={`http://localhost:5000/uploads/${listingInfo.imageFileNames[0]}`}
                alt={listingInfo.title}
                className="w-16 h-16 object-cover rounded"
              />
            )}
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{listingInfo.title}</h2>
              <p className="text-sm text-gray-600">{listingInfo.location}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg overflow-hidden" style={{ height: '600px' }}>
        <div className="bg-teal-600 text-white p-4">
          <h1 className="text-xl font-semibold">Chat</h1>
        </div>

        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: 'calc(600px - 140px)' }}>
            {messages.length === 0 ? (
              <p className="text-center text-gray-500 mt-8">No messages yet. Start the conversation!</p>
            ) : (
              messages.map((msg) => {
                const isMyMessage = msg.sender._id === user._id;
                return (
                  <div
                    key={msg._id}
                    className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isMyMessage
                          ? 'bg-teal-600 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="text-sm font-semibold mb-1">
                        {isMyMessage ? 'You' : msg.sender.username}
                      </p>
                      <p className="break-words">{msg.message}</p>
                      <p className="text-xs mt-1 opacity-75">
                        {new Date(msg.createdAt).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <form onSubmit={handleSendMessage} className="border-t p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition disabled:bg-teal-300"
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
