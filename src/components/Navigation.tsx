import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { 
  BookOpen, 
  Users, 
  User, 
  LogOut, 
  Home,
  Coins,
  GraduationCap
} from 'lucide-react';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const { tokenBalance } = useData();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/courses', label: 'Courses', icon: BookOpen },
    { path: '/community', label: 'Community', icon: Users },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                ICP Scholar
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-sm font-medium">
              <Coins className="h-4 w-4" />
              <span>{tokenBalance}</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <img
                  src={user?.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80`}
                  alt={user?.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
              
              <button
                onClick={logout}
                className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;