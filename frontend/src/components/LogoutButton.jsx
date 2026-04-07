import React from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { motion } from "framer-motion";
import { Power } from "lucide-react";

const LogoutButton = ({ children, className = "" }) => {
  const { logout } = useAuthStore();
  
  const onLogout = async () => {
    // Session termination logic
    await logout();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onLogout}
      className={`
        group relative flex items-center justify-center gap-3 
        px-8 py-4 rounded-2xl font-mono font-black uppercase tracking-widest
        bg-white/[0.03] border-2 border-white/5 text-slate-500
        hover:bg-rose-500/10 hover:border-rose-500/40 hover:text-rose-500
        transition-all duration-300 shadow-2xl ${className}
      `}
    >
      {/* 1. The Icon: Thicker stroke for 'Heavy' feel */}
      <Power size={18} strokeWidth={3} className="group-hover:rotate-180 transition-transform duration-700 ease-in-out" />
      
      {/* 2. The Text: Straight & Bold Mono */}
      <span className="text-[11px] tracking-[0.4em] leading-none">
        {children || "TERMINATE_SESSION"}
      </span>

      {/* 3. Emergency Glow Overlay */}
      <div className="absolute inset-0 rounded-2xl bg-rose-500/0 group-hover:bg-rose-500/5 blur-xl transition-all pointer-events-none" />
      
      {/* 4. Industrial Detail Line */}
      <div className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-0 h-[3px] bg-rose-500 group-hover:w-3/4 transition-all duration-500 shadow-[0_0_15px_#f43f5e]" />
      
      {/* 5. Corner Accent */}
      <div className="absolute top-2 right-2 size-1 bg-white/10 rounded-full group-hover:bg-rose-500 transition-colors" />
    </motion.button>
  );
};

export default LogoutButton;