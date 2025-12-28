import React from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, Palette } from 'lucide-react';

const Navbar = ({ user, handleLogout }) => {
  // The Backend URL for images
  const PF = "https://meraki-art.onrender.com";

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo Section */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="bg-blue-600 p-2 rounded-lg group-hover:rotate-12 transition-transform">
          <Palette className="text-white" size={24} />
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Meraki Art
        </span>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-8">
        <Link to="/" className="text-gray-300 hover:text-blue-400 font-medium transition">
          Explore
        </Link>
        
        {user ? (
          <div className="flex items-center gap-6">
            {/* Dashboard / Profile Link */}
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white group-hover:text-blue-400 transition">
                  {user.username}
                </p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Artist</p>
              </div>
              
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500 group-hover:border-white transition-all shadow-lg">
                {/* FIXED IMAGE LOGIC: Complete and correct pathing */}
                <img 
                  src={user.profilePic ? (user.profilePic.startsWith("http") || user.profilePic.startsWith("data") ? user.profilePic : PF + user.profilePic) : "https://via.placeholder.com/150"} 
                  alt="My Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.src = "https://via.placeholder.com/150"}
                />
              </div>
            </Link>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gray-800 hover:bg-red-900/30 text-gray-400 hover:text-red-500 px-4 py-2 rounded-xl border border-gray-700 hover:border-red-500/50 transition-all text-sm font-medium"
            >
              <LogOut size={16} />
              <span className="hidden md:block">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-300 hover:text-white font-medium">
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20"
            >
              Join Haven
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;