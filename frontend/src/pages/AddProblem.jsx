import React from 'react'
import { motion } from 'framer-motion'
import { Database, Plus, ShieldCheck, Terminal } from 'lucide-react'
import CreateProblemForm from '../components/AddProblemForm'

const AddProblem = () => {
  return (
    <div className="min-h-screen bg-[#050505] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* 1. Admin Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-black text-[10px] tracking-[0.3em] uppercase">
              <ShieldCheck size={14} />
              <span>Root_Access_Granted</span>
            </div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter">
              Expand <span className="text-primary">The Lab.</span>
            </h1>
            <p className="text-slate-500 font-medium max-w-md">
              Inject a new challenge into the global database. Ensure all test cases and constraints are optimized for the compilation engine.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl">
             <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Database size={20} />
             </div>
             <div>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Database_Status</p>
                <p className="text-xs font-bold uppercase italic">Ready_For_Injection</p>
             </div>
          </div>
        </motion.div>

        {/* 2. Form Container Wrapper */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          {/* Decorative Corner Accents */}
          <div className="absolute -top-2 -left-2 size-8 border-t-2 border-l-2 border-primary/30 rounded-tl-xl pointer-events-none" />
          <div className="absolute -bottom-2 -right-2 size-8 border-b-2 border-r-2 border-primary/30 rounded-br-xl pointer-events-none" />
          
          <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-sm shadow-2xl overflow-hidden relative">
            {/* Background "Ghost" Icon */}
            <Terminal className="absolute -bottom-10 -right-10 size-64 text-white/[0.01] -rotate-12 pointer-events-none" />
            
            <div className="relative z-10">
                <CreateProblemForm />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AddProblem