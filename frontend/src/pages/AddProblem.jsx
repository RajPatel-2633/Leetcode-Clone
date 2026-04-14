import React from 'react'
import { AnimatePresence,motion } from 'framer-motion'
import { Database, Plus, ShieldCheck, Terminal } from 'lucide-react'
import CreateProblemForm from '../components/AddProblemForm'


const AddProblem = () => {
  return (
    <div className="min-h-screen bg-[#050505] py-12 px-6 font-primary">
      <div className="max-w-6xl mx-auto">
        
        {/* 1. Admin Header Section: Straight & Authoritative */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 border-b-2 border-white/5 pb-12"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <ShieldCheck size={18} strokeWidth={3} />
              <span className="font-mono font-black text-[11px] tracking-[0.5em] uppercase">
                Root_Access_Authorized
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black uppercase font-display tracking-tight text-white leading-none">
              Expand <span className="text-primary">The Lab</span><span className="text-white/20">_</span>
            </h1>
            
            <p className="text-slate-400 font-mono text-[11px] font-bold uppercase tracking-widest max-w-xl leading-relaxed">
              Inject new computational challenges into the global database. 
              Validate all test cases against the core compilation engine.
            </p>
          </div>

          {/* Database Status Widget: Heavy Chassis */}
          <div className="hidden lg:flex items-center gap-5 bg-white/[0.03] border-2 border-white/5 p-5 rounded-2xl shadow-xl">
             <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Database size={24} strokeWidth={2.5} />
             </div>
             <div>
                <p className="text-[11px] font-mono font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Database_Link</p>
                <p className="text-sm font-black font-display text-white uppercase tracking-tight">READY_FOR_INJECTION</p>
             </div>
          </div>
        </motion.div>

        {/* 2. Form Container Wrapper: Industrial Casing */}
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          {/* Decorative Heavy Corner Accents */}
          <div className="absolute -top-3 -left-3 size-12 border-t-4 border-l-4 border-primary rounded-tl-lg pointer-events-none z-20" />
          <div className="absolute -bottom-3 -right-3 size-12 border-b-4 border-r-4 border-primary rounded-br-lg pointer-events-none z-20" />
          
          <div className="bg-[#080808] border-2 border-white/5 rounded-[1.5rem] p-8 md:p-16 backdrop-blur-md shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden relative">
            
            {/* Background "Ghost" Icon: Technical depth */}
            <Terminal className="absolute -bottom-16 -right-16 size-96 text-white/[0.01] pointer-events-none" strokeWidth={1} />
            
            <div className="relative z-10">
                <CreateProblemForm />
            </div>

            {/* Bottom Status Bar Decoration */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
              <motion.div 
                className="h-full bg-primary/20" 
                animate={{ width: ["0%", "100%", "0%"] }} 
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Footer Technical Metadata */}
        <div className="mt-8 flex justify-between items-center opacity-20 px-4">
           <span className="text-[11px] font-mono font-black uppercase tracking-[1em]">LeetLabs_Auth_v4.0.2</span>
           <div className="flex gap-4">
              <div className="h-1 w-12 bg-white/20" />
              <div className="h-1 w-6 bg-primary" />
           </div>
        </div>
      </div>
    </div>
  )
}

export default AddProblem