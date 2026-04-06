import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';

const Layout = () => {
  const location = useLocation();

  return (
    /* CHANGE: Fixed height (h-screen) and hidden overflow. 
       This prevents the whole browser window from scrolling.
    */
    <div className="relative h-screen w-full bg-[#050505] text-white overflow-hidden flex flex-col">
      
      {/* 1. Global Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] opacity-30" />
      </div>

      {/* 2. Floating Navbar Area */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* 3. Independent Scroll Container */}
      /* CHANGE: flex-1 ensures it takes all space below Navbar. 
         overflow-hidden here allows child components to control their own scroll.
      */
      <main className="relative z-10 flex-1 overflow-hidden pt-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            /* This div handles the scroll for standard pages like Home/Profile.
               For the ProblemPage, we will handle internal scrolling.
            */
            className="h-full w-full overflow-y-auto custom-scrollbar px-4 md:px-6 pb-10"
          >
            <div className="max-w-[1800px] mx-auto">
                <Outlet />
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 4. Subtle Scanline Effect */}
      <div className="fixed inset-0 z-40 pointer-events-none opacity-[0.015] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </div>
  )
}

export default Layout;