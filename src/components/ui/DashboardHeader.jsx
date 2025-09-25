import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const DashboardHeader = ({ 
  user = { name: 'Student User', role: 'student', lastLogin: '2025-09-09 15:30' },
  onLogout,
  isCollapsed = false,
  onToggleSidebar
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Default logout behavior
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      navigate('/user-login');
    }
    setShowUserMenu(false);
  };

  const formatLastLogin = (timestamp) => {
    const date = new Date(timestamp);
    return date?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-surface border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section - Logo and Sidebar Toggle */}
        <div className="flex items-center space-x-4">
          {/* Sidebar Toggle (Mobile) */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-md hover:bg-accent transition-colors duration-200"
              aria-label="Toggle sidebar"
            >
              <Icon name="Menu" size={20} />
            </button>
          )}

          {/* Logo */}
          <Link to={user?.role === 'admin' ? '/admin-dashboard' : '/student-dashboard'} className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
              <svg
                className="w-4 h-4 text-primary-foreground"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <span className="text-lg font-semibold text-text-primary hidden sm:block">
              StudentAnalytics
            </span>
          </Link>
        </div>

        {/* Right Section - User Menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 rounded-md hover:bg-accent transition-colors duration-200 relative">
            <Icon name="Bell" size={20} className="text-text-secondary" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full text-xs"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-foreground">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-text-primary">{user?.name}</p>
                <p className="text-xs text-text-secondary capitalize">{user?.role}</p>
              </div>
              <Icon 
                name="ChevronDown" 
                size={16} 
                className={`text-text-secondary transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} 
              />
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-popover border border-border rounded-lg shadow-lg z-50 animate-fade-in">
                <div className="p-4 border-b border-border">
                  <p className="font-medium text-text-primary">{user?.name}</p>
                  <p className="text-sm text-text-secondary capitalize">{user?.role} Account</p>
                  {user?.lastLogin && (
                    <p className="text-xs text-text-secondary mt-1">
                      Last login: {formatLastLogin(user?.lastLogin)}
                    </p>
                  )}
                </div>
                
                <div className="py-2">
                  <button className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-accent transition-colors duration-200 flex items-center space-x-2">
                    <Icon name="User" size={16} />
                    <span>Profile Settings</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-accent transition-colors duration-200 flex items-center space-x-2">
                    <Icon name="Settings" size={16} />
                    <span>Preferences</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-accent transition-colors duration-200 flex items-center space-x-2">
                    <Icon name="HelpCircle" size={16} />
                    <span>Help & Support</span>
                  </button>
                </div>

                <div className="border-t border-border py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-error hover:bg-accent transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Icon name="LogOut" size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Click outside to close menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
};

export default DashboardHeader;