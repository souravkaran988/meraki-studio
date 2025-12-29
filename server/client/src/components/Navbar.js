import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Sparkles, LogOut, User as UserIcon, LayoutGrid, Home, Zap } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
    window.location.reload();
  };

  // Helper to highlight active page
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="w-full sticky top-0 z-50 bg-[#0d1117]/90 backdrop-blur-xl border-b border-white/[0.05] shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* --- LEFT: LOGO --- */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
            <div className="relative p-2.5 bg-[#161b22] border border-white/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Sparkles size={20} className="text-blue-500" fill="currentColor" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black italic tracking-tighter text-white uppercase leading-none">Meraki</span>
            <span className="text-[8px] font-bold text-blue-500 uppercase tracking-[0.4em] ml-0.5">Studio</span>
          </div>
        </Link>

        {/* --- CENTER: NAVIGATION --- */}
        <div className="hidden md:flex items-center bg-white/[0.03] border border-white/[0.08] px-2 py-1.5 rounded-2xl">
          <NavLink to="/" icon={<Home size={14}/>} label="Home" active={isActive("/")} />
          
          {username && (
            <>
              <NavLink 
                to={`/dashboard/${username}`} 
                icon={<LayoutGrid size={14}/>} 
                label="Dashboard" 
                active={location.pathname.includes("/dashboard")} 
              />
              <NavLink 
                to={`/profile/${username}`} 
                icon={<UserIcon size={14}/>} 
                label="Profile" 
                active={location.pathname.includes("/profile")} 
              />
            </>
          )}
        </div>

        {/* --- RIGHT: ACTIONS --- */}
        <div className="flex items-center gap-4">
          {username ? (
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-300"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          ) : (
            <Link 
              to="/auth" 
              className="relative group px-7 py-3 overflow-hidden rounded-xl bg-blue-600 transition-all duration-300 active:scale-95"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <span className="relative flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                <Zap size={14} fill="white" />
                Join Studio
              </span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

// Sub-component for clean Nav Links
const NavLink = ({ to, icon, label, active }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
      active 
        ? "bg-blue-600/10 text-blue-400 shadow-[inset_0_0_12px_rgba(37,99,235,0.1)]" 
        : "text-gray-500 hover:text-white hover:bg-white/5"
    }`}
  >
    {icon}
    {label}
  </Link>
);

export default Navbar;