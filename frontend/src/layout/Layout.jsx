import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="relative h-screen w-full bg-[#020202] text-white overflow-hidden flex flex-col font-primary">
      
      {/* 1. GLOBAL COSMIC ENVIRONMENT */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Structural Hardware Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '100px 100px' 
          }} 
        />

        {/* Orbital Nebula Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-blue-900/10 rounded-full blur-[160px] opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[140px] opacity-40" />

        {/* Atmospheric Dust Particles */}
        <div 
          className="absolute inset-0 opacity-[0.05]" 
          style={{ 
            backgroundImage: `radial-gradient(circle, #fff 1px, transparent 0.5px)`,
            backgroundSize: '60px 60px' 
          }} 
        />
      </div>

      {/* 2. COMMAND NAVIGATION AREA (Fixed at top) */}
      <div className="relative z-50 shrink-0">
        <Navbar />
      </div>

      {/* 3. MAIN MISSION VIEWPORT */}
      <main className="relative z-10 flex-1 overflow-hidden pt-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
            className="h-full w-full overflow-y-auto custom-scrollbar px-6 md:px-10 pb-20"
          >
            <div className="max-w-[1800px] mx-auto">
              <Outlet />
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 4. CRT SCANLINE OVERLAY (For that hardware screen feel) */}
      <div className="fixed inset-0 z-40 pointer-events-none opacity-[0.015] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      
      {/* 5. TELEMETRY WATERMARK */}
      <div className="fixed bottom-6 left-8 z-50 pointer-events-none flex flex-col gap-1">
        <span className="text-[7px] font-mono font-black text-slate-800 uppercase tracking-[0.8em]">
          COORD_SYS: L-SPACE.V4
        </span>
        <div className="h-[1px] w-12 bg-white/5" />
      </div>

      <div className="fixed bottom-6 right-8 z-50 pointer-events-none">
        <div className="flex items-center gap-4 bg-black/60 border-2 border-white/5 px-5 py-2 rounded-xl backdrop-blur-xl shadow-2xl">
          <div className="size-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[9px] font-mono font-black uppercase tracking-[0.4em] text-slate-500">
            Node_Loc: {location.pathname === '/' ? 'COMMAND_DECK' : location.pathname.split('/')[1].toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Layout;