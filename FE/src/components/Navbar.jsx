import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-teal-600">
              CampusStay
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700 hidden md:block">Hello, {user.username}</span>
                <Link
                  to="/messages"
                  className="text-gray-600 hover:text-teal-600 transition"
                >
                  💬 Messages
                </Link>
                <Link
                  to="/create"
                  className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition"
                >
                  Create Listing
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-500 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-teal-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
