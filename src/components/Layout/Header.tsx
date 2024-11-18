import React from 'react';
import { BookOpen, Home, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  return (
    <header className="bg-indigo-700 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-white" />
            <h1 className="text-xl font-bold text-white">Year 7 Mathematics</h1>
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <NavLink to="/" icon={<Home className="h-5 w-5" />} label="Home" />
          {isAuthenticated && (
            <>
              {(['Student', 'Tutor', 'Admin'].includes(user?.role || '')) && (
                <NavLink to="/mathematics" label="Mathematics" />
              )}
              <NavLink to="/progress" label="My Progress" />
              <div className="flex items-center space-x-4">
                <span className="text-white text-sm">
                  {user?.name} ({user?.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-white hover:text-gray-200"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
          {!isAuthenticated && (
            <Link
              to="/login"
              className="text-white hover:text-gray-200 font-medium"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

function NavLink({ to, label, icon }: { to: string; label: string; icon?: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
        ${isActive 
          ? 'bg-indigo-800 text-white' 
          : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'
        }`}
    >
      {icon && icon}
      <span>{label}</span>
    </Link>
  );
}