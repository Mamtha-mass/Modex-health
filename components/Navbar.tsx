import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { user, setUser } = useAppContext();
  const location = useLocation();

  const toggleRole = () => {
    setUser({
      ...user,
      role: user.role === 'ADMIN' ? 'USER' : 'ADMIN',
      name: user.role === 'ADMIN' ? 'Guest Patient' : 'Clinic Admin'
    });
  };

  return (
    <nav className="bg-white shadow-sm border-b border-teal-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="bg-teal-100 p-1.5 rounded-lg group-hover:bg-teal-200 transition-colors">
                <svg className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="font-bold text-xl text-gray-800 tracking-tight">Modex<span className="text-teal-600">Health</span></span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`${location.pathname === '/' ? 'border-teal-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
              >
                Find Doctors
              </Link>
              {user.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className={`${location.pathname.startsWith('/admin') ? 'border-teal-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
                >
                  Manage Schedule
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Current Role</p>
              <p className="text-sm font-medium text-gray-800">{user.name}</p>
            </div>
            <button
              onClick={toggleRole}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                user.role === 'ADMIN' 
                  ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' 
                  : 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100'
              }`}
            >
              Switch to {user.role === 'ADMIN' ? 'Patient' : 'Admin'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
