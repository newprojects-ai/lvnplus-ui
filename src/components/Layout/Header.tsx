import React from 'react';
import { BookOpen, Home, LogOut, Trophy, Star, Flame, Users, Calendar, TrendingUp } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useGamification } from '../../contexts/GamificationContext';
import { Role } from '../../types/auth';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { studentProgress } = useGamification();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isRoleAllowed = (allowedRoles: string[]) => {
    return user && user.roles.some(role => allowedRoles.includes(role));
  };
  
  return (
    <header className="bg-indigo-700 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-white" />
            <h1 className="text-xl font-bold text-white">Year 7 Mathematics</h1>
          </Link>
        </div>
        
        {/* Center - Navigation */}
        <div className="flex items-center space-x-6">
          {isAuthenticated && (
            <>
              {isRoleAllowed(['Parent']) ? (
                <>
                  <NavLink 
                    to="/parent/profiles" 
                    icon={<Users className="h-5 w-5" />} 
                    label="Child Profiles" 
                  />
                  <NavLink 
                    to="/parent/scheduler" 
                    icon={<Calendar className="h-5 w-5" />} 
                    label="Test Scheduler" 
                  />
                  <NavLink 
                    to="/parent/performance" 
                    icon={<TrendingUp className="h-5 w-5" />} 
                    label="Performance" 
                  />
                </>
              ) : isRoleAllowed(['Student', 'Tutor', 'Admin']) && (
                <>
                  <NavLink to="/" icon={<Home className="h-5 w-5" />} label="Home" />
                  <NavLink to="/subjects" label="Subjects" />
                  <NavLink to="/progress" label="My Progress" />
                </>
              )}
            </>
          )}
        </div>

        {/* Right Side - User Info & Gamification */}
        {isAuthenticated && user && (
          <div className="flex items-center space-x-6">
            {/* XP & Level - Only show for Student role */}
            {isRoleAllowed(['Student']) && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center bg-indigo-800 rounded-full px-3 py-1">
                  <Trophy className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium text-white">Level {studentProgress?.level || 1}</span>
                </div>
                <div className="hidden md:flex items-center bg-indigo-800 rounded-full px-3 py-1">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium text-white">
                    {studentProgress?.currentXP || 0} XP
                  </span>
                </div>
              </div>
            )}

            {/* Streak - Only show for Student role */}
            {isRoleAllowed(['Student']) && (
              <div className="hidden md:flex items-center bg-indigo-800 rounded-full px-3 py-1">
                <Flame className="h-4 w-4 text-orange-400 mr-1" />
                <span className="text-sm font-medium text-white">
                  {studentProgress?.streakDays || 0} Day Streak
                </span>
              </div>
            )}

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <span className="text-white text-sm">
                {user?.firstName} {user?.lastName} ({user?.roles.join(', ')})
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-white hover:text-gray-200"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
        {!isAuthenticated && (
          <Link
            to="/login"
            className="text-white hover:text-gray-200 font-medium"
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}

function NavLink({ to, label, icon }: { to: string; label: string; icon?: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
  
  return (
    <Link
      to={to}
      className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
        isActive
          ? 'text-white bg-indigo-800'
          : 'text-indigo-100 hover:text-white hover:bg-indigo-600'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}