import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code2, LogOut, User, LayoutDashboard, Settings, Users } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import { motion } from 'framer-motion';
import Avatar from '../ui/Avatar';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate('/');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0d1117]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-green-400 to-emerald-600 p-1.5 rounded-lg">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">CoDrift</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <Link to="/features" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Features</Link>
              <Link to="/about" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">About</Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm font-medium"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link 
                  to="/friends" 
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm font-medium"
                >
                  <Users className="w-4 h-4" />
                  <span>Network</span>
                </Link>
                <div className="h-6 w-px bg-white/10" />
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/profile" 
                    className="hover:ring-2 hover:ring-green-400 transition-all rounded-full flex items-center justify-center"
                    title="Edit Profile"
                  >
                    <Avatar 
                      src={user?.avatar} 
                      name={user?.name} 
                      email={user?.email}
                      className="w-8 h-8" 
                      textClassName="text-xs" 
                      borderClassName="border border-white/10"
                    />
                  </Link>
                  <button 
                    onClick={() => setShowLogoutModal(true)}
                    className="text-gray-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-400/10"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:text-white transition-colors text-sm font-medium px-4 py-2"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-green-900/20 active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>

    {}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-[#161b22] border border-white/10 p-6 rounded-2xl shadow-2xl max-w-md w-full"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-red-500/20 p-3 rounded-full border border-red-500/30">
                <LogOut className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Confirm Logout</h3>
                <p className="text-gray-400 text-sm">Are you sure you want to sign out?</p>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-8">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-white font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium transition-colors shadow-lg shadow-red-900/20"
              >
                Yes, Sign Out
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Navbar;

