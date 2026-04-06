import React from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { motion } from "framer-motion";
import { Power } from "lucide-react";

const LogoutButton = ({ children, className = "" }) => {
  const { logout } = useAuthStore();
  
  const onLogout = async () => {
    // You could add a "Terminating Session..." toast here if you like!
    await logout();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onLogout}
      className={`
        group relative flex items-center justify-center gap-2 
        px-6 py-3 rounded-xl font-black uppercase italic tracking-tighter
        bg-white/5 border border-white/10 text-slate-400
        hover:bg-red-500/10 hover:border-red-500/40 hover:text-red-400
        transition-all duration-300 shadow-lg ${className}
      `}
    >
      {/* 1. The Icon (Optional, but looks great) */}
      <Power size={16} className="group-hover:rotate-90 transition-transform duration-500" />
      
      {/* 2. The Text */}
      <span className="text-[10px] tracking-[0.2em]">
        {children || "Terminate_Session"}
      </span>

      {/* 3. Subtle Red Glow Overlay */}
      <div className="absolute inset-0 rounded-xl bg-red-500/0 group-hover:bg-red-500/5 blur-md transition-all pointer-events-none" />
      
      {/* 4. Bottom Detail Line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-red-500 group-hover:w-1/2 transition-all duration-500 shadow-[0_0_10px_#ef4444]" />
    </motion.button>
  );
};

export default LogoutButton;