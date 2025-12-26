import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, Menu, Palette } from "lucide-react"; 
import { useState, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
    window.location.reload(); 
  };

  return (
    /* CHANGED: bg-gray-800 creates a nice contrast with the bg-gray-900 body */
    <nav className="bg-gray-800 border-b border-gray-700 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <Palette size={28} className="text-blue-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              Meraki
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-blue-400 transition font-medium">Home</Link>
            
            {user ? (
              <div className="flex items-center gap-6">
                <Link to="/dashboard" className="flex items-center gap-2 hover:text-blue-400 transition font-medium">
                  {user.profilePic ? (
                    <img src={user.profilePic} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-gray-600" />
                  ) : (
                    <User size={20} />
                  )}
                  <span>{user.username}</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition font-medium">
                  <LogOut size={18} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="hover:text-blue-400 transition font-medium">Login</Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md transition font-medium shadow-md shadow-blue-500/20">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 p-4 space-y-4 border-t border-gray-700">
          <Link to="/" className="block text-gray-300 hover:text-white">Home</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="block text-gray-300 hover:text-white">Dashboard</Link>
              <button onClick={handleLogout} className="block text-red-400 w-full text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-gray-300 hover:text-white">Login</Link>
              <Link to="/register" className="block text-blue-400">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;