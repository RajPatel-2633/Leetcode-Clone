import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useProblemStore } from "../store/useProblemStore.js";
import ProblemsTable from "../components/ProblemTable.jsx";
import { Loader2, Terminal, Activity, Zap } from "lucide-react";

const HomePage = () => {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  if (isProblemsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-primary">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse rounded-full" />
          <Loader2 className="size-12 animate-spin relative z-10" />
        </div>
        <p className="mt-4 text-[10px] font-black tracking-[0.3em] uppercase opacity-40">Syncing Database...</p>
      </div>
    );
  }

  return (
    <section className="relative w-full max-w-7xl mx-auto py-12">
      {/* 1. Hero Section - Left Aligned for "Power" Layout */}
      <div className="grid lg:grid-cols-2 gap-10 items-end mb-16 px-4">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 text-primary font-black text-xs tracking-[0.2em] uppercase">
            <Activity size={14} />
            <span>Active Session: {new Date().toLocaleDateString()}</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.9]">
            The <span className="text-primary">Lab</span> <br /> 
            Is Open.
          </h1>
          
          <p className="max-w-md text-slate-500 font-medium leading-relaxed">
            Initialize your training sequence. Master algorithms, conquer data structures, and optimize your logic in the ultimate coding environment.
          </p>
        </motion.div>

        {/* 2. Quick Stats / Status Cards (Right Side) */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:flex justify-end gap-4"
        >
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md w-48 transition-all hover:border-primary/50 group">
            <Zap className="text-primary mb-3 group-hover:scale-110 transition-transform" size={24} />
            <div className="text-2xl font-black tracking-tighter italic">{problems?.length || 0}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Problems</div>
          </div>
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md w-48 transition-all hover:border-primary/50 group">
            <Terminal className="text-primary mb-3 group-hover:scale-110 transition-transform" size={24} />
            <div className="text-2xl font-black tracking-tighter italic">ONLINE</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Compiler Status</div>
          </div>
        </motion.div>
      </div>

      {/* 3. Problem Table Container */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full px-4"
      >
        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-4 md:p-8 backdrop-blur-sm shadow-2xl">
          <div className="flex items-center justify-between mb-8 px-4">
             <h3 className="text-sm font-black tracking-[0.2em] uppercase text-slate-400">Directory / All_Problems</h3>
             <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent mx-6 hidden md:block" />
          </div>

          {problems && problems.length > 0 ? (
            <ProblemsTable problems={problems} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
              <Terminal size={40} className="text-slate-700 mb-4" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
                No active datasets found
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Background Decorative Blob */}
      <div className="fixed top-1/3 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none z-[-1]" />
    </section>
  );
};

export default HomePage;