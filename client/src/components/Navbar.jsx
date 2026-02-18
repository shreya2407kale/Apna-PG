import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            🏠 Apna PG
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/browse" className="hover:text-blue-200">
              Browse PGs
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === 'Owner' && (
                  <Link to="/owner-dashboard" className="hover:text-blue-200">
                    Owner Dashboard
                  </Link>
                )}
                {user?.role === 'User' && (
                  <Link to="/my-bookings" className="hover:text-blue-200">
                    My Bookings
                  </Link>
                )}
                {user?.role === 'Admin' && (
                  <Link to="/admin" className="hover:text-blue-200">
                    Admin Panel
                  </Link>
                )}
                <div className="flex items-center space-x-4">
                  <span className="text-sm">{user?.fullName}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/browse" className="block hover:text-blue-200">
              Browse PGs
            </Link>
            {isAuthenticated ? (
              <>
                {user?.role === 'Owner' && (
                  <Link to="/owner-dashboard" className="block hover:text-blue-200">
                    Owner Dashboard
                  </Link>
                )}
                {user?.role === 'User' && (
                  <Link to="/my-bookings" className="block hover:text-blue-200">
                    My Bookings
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left hover:text-blue-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block hover:text-blue-200">
                  Login
                </Link>
                <Link to="/register" className="block hover:text-blue-200">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
