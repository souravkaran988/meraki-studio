import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Sparkles, LogOut, User as UserIcon, LayoutGrid, Home, Zap, Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem("username");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
    window.location.reload();
  };

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

        {/* --- CENTER: NAVIGATION (Desktop) --- */}
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
              className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-300"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          ) : (
            <Link 
              to="/auth" 
              className="hidden md:flex relative group px-7 py-3 overflow-hidden rounded-xl bg-blue-600 transition-all duration-300 active:scale-95"
            >
              <span className="relative flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                <Zap size={14} fill="white" />
                Join Studio
              </span>
            </Link>
          )}

          {/* --- HAMBURGER BUTTON (Mobile only) --- */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2.5 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      {menuOpen && (
        <div className="md:hidden bg-[#0d1117] border-t border-white/[0.05] px-6 py-4 flex flex-col gap-3">
          <MobileNavLink 
            to="/" 
            icon={<Home size={16}/>} 
            label="Home" 
            active={isActive("/")} 
            onClick={() => setMenuOpen(false)} 
          />
          {username && (
            <>
              <MobileNavLink 
                to={`/dashboard/${username}`} 
                icon={<LayoutGrid size={16}/>} 
                label="Dashboard" 
                active={location.pathname.includes("/dashboard")} 
                onClick={() => setMenuOpen(false)} 
              />
              <MobileNavLink 
                to={`/profile/${username}`} 
                icon={<UserIcon size={16}/>} 
                label="Profile" 
                active={location.pathname.includes("/profile")} 
                onClick={() => setMenuOpen(false)} 
              />
            </>
          )}

          {/* Divider */}
          <div className="border-t border-white/10 mt-2 pt-3">
            {username ? (
              <button 
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500 text-sm font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            ) : (
              <Link 
                to="/auth" 
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white text-sm font-black uppercase tracking-widest hover:bg-blue-500 transition-all"
              >
                <Zap size={16} fill="white" />
                Join Studio
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// Desktop Nav Link
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

// Mobile Nav Link
const MobileNavLink = ({ to, icon, label, active, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-300 ${
      active 
        ? "bg-blue-600/10 text-blue-400" 
        : "text-gray-500 hover:text-white hover:bg-white/5"
    }`}
  >
    {icon}
    {label}
  </Link>
);

export default Navbar;