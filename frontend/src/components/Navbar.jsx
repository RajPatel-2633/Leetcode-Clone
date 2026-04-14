import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Terminal, 
  User, 
  PlusSquare, 
  LogOut, 
  LayoutDashboard,
  Zap,
  Satellite
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Profile", path: "/profile", icon: User },
  ];

  if (authUser?.role === "ADMIN") {
    navLinks.push({ name: "Add_Module", path: "/add-problem", icon: PlusSquare });
  }

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-5xl px-4">
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative flex items-center justify-between bg-black/60 backdrop-blur-xl border-2 border-white/5 px-6 py-3 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)]"
      >
        {/* 1. Industrial Logo: LEET_SPACE Identity */}
        <Link to="/" className="flex items-center gap-4 group">
          <div className="relative flex items-center justify-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-primary/20 rounded-lg blur-md group-hover:bg-primary/40 transition-colors"
            />
            <div className="relative bg-primary p-2.5 rounded-lg text-black shadow-[0_0_20px_rgba(var(--p),0.5)]">
              <Zap size={20} strokeWidth={3} />
            </div>
          </div>
          <div className="flex flex-col leading-none hidden sm:flex">
            <span className="text-2xl font-black tracking-tight uppercase font-display text-white">
              LEET<span className="text-primary">SPACE</span>
            </span>
            <span className="text-[11px] font-mono font-black text-slate-400 tracking-[0.6em] mt-1">
              ORBITAL_SECTOR_01
            </span>
          </div>
        </Link>

        {/* 2. Navigation Links */}
        <div className="flex items-center gap-2 md:gap-4">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className="relative px-4 py-2 transition-all group"
            >
              <div className={`flex items-center gap-2 font-mono font-black text-[11px] uppercase tracking-[0.2em] transition-colors ${
                isActive(link.path) ? "text-primary" : "text-slate-400 hover:text-white"
              }`}>
                <link.icon size={16} strokeWidth={isActive(link.path) ? 3 : 2} />
                <span className="hidden md:block">{link.name}</span>
              </div>
              
              {isActive(link.path) && (
                <motion.div 
                  layoutId="nav-active"
                  className="absolute -bottom-1 left-4 right-4 h-[3px] bg-primary shadow-[0_0_15px_#7480ff] rounded-full"
                />
              )}
            </Link>
          ))}
        </div>

        {/* 3. Status Area */}
        <div className="flex items-center gap-4 pl-4 border-l-2 border-white/5">
            <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 bg-white/[0.03] rounded-lg border border-white/5">
               <Satellite size={12} className="text-primary animate-pulse" />
               <span className="text-[11px] font-mono font-black text-slate-400 tracking-[0.3em]">SYSTEM_LINK</span>
            </div>

          <button 
            onClick={logout}
            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all active:scale-90"
            title="Terminate Session"
          >
            <LogOut size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Heavy Detail Line */}
        <div className="absolute inset-x-20 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </motion.div>
    </nav>
  );
};

export default Navbar;