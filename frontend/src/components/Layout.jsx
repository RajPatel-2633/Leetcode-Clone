import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="relative h-screen w-full bg-[#050505] text-white overflow-hidden flex flex-col font-primary">
      
      {/* 1. Global Technical Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Subtle Grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]" 
          style={{ 
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '80px 80px' 
          }} 
        />
        <div className="absolute top-[-10%] left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] opacity-40" />
        <div className="absolute bottom-[-10%] right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] opacity-30" />
      </div>

      {/* 2. Command Navigation Area */}
      <div className="relative z-50 shrink-0">
        <Navbar />
      </div>

      {/* 3. Main Data Viewport */}
      <main className="relative z-10 flex-1 overflow-hidden pt-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="h-full w-full overflow-y-auto custom-scrollbar px-6 md:px-10 pb-20"
          >
            <div className="max-w-[1800px] mx-auto">
              <Outlet />
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 4. CRT / Scanline Overlay */}
      <div className="fixed inset-0 z-40 pointer-events-none opacity-[0.015] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      
      {/* 5. Sector Metadata Corner */}
      <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
        <div className="flex items-center gap-3 bg-black/40 border border-white/5 px-4 py-2 rounded-full backdrop-blur-md">
          <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[8px] font-mono font-black uppercase tracking-[0.4em] text-slate-500">
            System_Node: {location.pathname === '/' ? 'DASHBOARD' : location.pathname.split('/')[1].toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Layout;