import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Terminal, 
  User, 
  PlusSquare, 
  LogOut, 
  LayoutDashboard,
  Zap
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const location = useLocation();

  // Helper to check if a link is active for the "glow" indicator
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Profile", path: "/profile", icon: User },
  ];

  // Admin-only link
  if (authUser?.isAdmin) {
    navLinks.push({ name: "Add Problem", path: "/add-problem", icon: PlusSquare });
  }

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-4xl px-4">
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative flex items-center justify-between bg-black/40 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        {/* 1. Custom Animated Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-primary/20 rounded-lg blur-md group-hover:bg-primary/40 transition-colors"
            />
            <div className="relative bg-primary p-2 rounded-lg text-black">
              <Terminal size={20} strokeWidth={3} />
            </div>
          </div>
          <span className="text-xl font-black tracking-tighter uppercase italic hidden sm:block">
            Leet<span className="text-primary">Labs</span>
          </span >
        </Link>

        {/* 2. Navigation Links */}
        <div className="flex items-center gap-2 md:gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className="relative px-3 py-2 transition-colors group"
            >
              <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-widest ${
                isActive(link.path) ? "text-white" : "text-slate-500 hover:text-white"
              }`}>
                <link.icon size={16} strokeWidth={isActive(link.path) ? 2.5 : 2} />
                <span className="hidden md:block">{link.name}</span>
              </div>
              
              {/* Active Indicator Glow */}
              {isActive(link.path) && (
                <motion.div 
                  layoutId="nav-active"
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-primary shadow-[0_0_10px_#7480ff]"
                />
              )}
            </Link>
          ))}
        </div>

        {/* 3. Action Area */}
        <div className="flex items-center gap-4 pl-4 border-l border-white/10">
           {/* Dynamic "Energy" Indicator */}
           <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
              <Zap size={12} className="text-yellow-400 fill-yellow-400 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400">LAB ONLINE</span>
           </div>

          <button 
            onClick={logout}
            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>

        {/* Subtle Bottom Border Glow for the whole Navbar */}
        <div className="absolute inset-x-10 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </motion.div>
    </nav>
  );
};

export default Navbar;