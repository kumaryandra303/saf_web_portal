import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Bell, Settings, Menu, X, ChevronDown } from 'lucide-react';

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // Format last login time
  const formatLastLogin = (loginTime) => {
    if (!loginTime) return 'N/A';
    try {
      const date = new Date(loginTime);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    } catch (error) {
      return 'N/A';
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  // Get user initial for avatar
  const getUserInitial = () => {
    if (user?.fullName) return user.fullName.charAt(0).toUpperCase();
    if (user?.username) return user.username.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <header className="sticky top-0 bg-gradient-to-r from-red-600 to-amber-600 border-b border-amber-300 z-50 shadow-lg">
      {/* Top Row - Logo and User Details */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Hamburger Menu, Logo and Title */}
        <div className="flex items-center gap-3 lg:gap-4">
          {/* Hamburger Menu */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors lg:hidden flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          
          {/* Logo - Always visible in header */}
          <div className="flex-shrink-0">
            <img 
              src="/assets/saf_logo.jpeg" 
              alt="SAF Logo" 
              className="w-16 h-16 rounded object-cover border-2 border-white/30 shadow-md"
              onError={(e) => {
                // Try alternative path if first fails
                if (e.target.src.includes('/assets/')) {
                  e.target.src = '/saf_logo.jpeg';
                } else {
                  // Final fallback: show placeholder
                  e.target.style.display = 'none';
                  const placeholder = document.createElement('div');
                  placeholder.className = 'w-16 h-16 rounded bg-white/20 flex items-center justify-center text-white font-bold text-lg border-2 border-white/30 shadow-md';
                  placeholder.textContent = 'SAF';
                  e.target.parentNode.appendChild(placeholder);
                }
              }}
            />
          </div>
          
          {/* Title */}
          <div className="hidden sm:block">
            <div className="text-xl font-semibold drop-shadow-md text-white" style={{ color: '#ffffff !important', WebkitTextFillColor: '#ffffff !important' }}>
              Settibalija Action Force Management
            </div>
          </div>
        </div>

        {/* Right side - User Menu */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="group flex items-center space-x-2 p-2 rounded-md !text-white hover:!bg-white/20 hover:!text-black transition-all duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-medium text-sm shadow-md">
              {getUserInitial()}
            </div>
            <span className="hidden sm:block text-sm font-medium !text-white group-hover:!text-black drop-shadow-sm">
              {user?.fullName || user?.username || 'User'}
            </span>
            <ChevronDown className={`h-4 w-4 !text-white group-hover:!text-black transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-[100] animate-fade-in">
              <div className="py-1">
                {/* User Info Header */}
                <div className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                  <div className="font-medium text-gray-900 dark:text-white text-base">
                    {user?.fullName || user?.username || 'User'}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-xs mt-1 font-medium">
                    {user?.role || user?.designation || 'Administrator'}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                    {user?.email || 'No email'}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                    Last Login: {formatLastLogin(user?.loginTime)}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="py-1">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    My Profile
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <div className="border-t border-gray-200 dark:border-gray-700 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;







