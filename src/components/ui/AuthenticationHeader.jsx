import React from 'react';
import { Link } from 'react-router-dom';

const AuthenticationHeader = ({ showNavigation = true }) => {
  return (
    <header className="w-full bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-primary-foreground"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-semibold text-text-primary">
                  Edulens
                </span>
                <span className="text-xs text-text-secondary hidden sm:block">
                  Empowering Educational Excellence
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          {showNavigation && (
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/user-login"
                className="text-text-secondary hover:text-primary transition-colors duration-200 font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/user-registration"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium"
              >
                Get Started
              </Link>
            </nav>
          )}

          {/* Mobile Navigation */}
          {showNavigation && (
            <div className="md:hidden flex items-center space-x-3">
              <Link
                to="/user-login"
                className="text-text-secondary hover:text-primary transition-colors duration-200 text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/user-registration"
                className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors duration-200 text-sm font-medium"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AuthenticationHeader;