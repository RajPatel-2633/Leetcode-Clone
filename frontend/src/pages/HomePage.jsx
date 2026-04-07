import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useProblemStore } from "../store/useProblemStore.js";
import ProblemsTable from "../components/ProblemTable.jsx";
import { Loader2, Terminal, Activity, Zap, Database, Satellite } from "lucide-react";

const HomePage = () => {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  if (isProblemsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-primary font-mono bg-[#050505]">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse rounded-full" />
          <Loader2 className="size-16 animate-spin relative z-10 stroke-[3px]" />
        </div>
        <p className="mt-8 text-[11px] font-black tracking-[0.6em] uppercase text-primary/60">
          Syncing_Station_Archive...
        </p>
      </div>
    );
  }

  return (
    <section className="relative w-full max-w-[1800px] mx-auto py-12 px-6">
      
      {/* 1. Hero Section: Orbital Command Center Vibe */}
      <div className="grid lg:grid-cols-2 gap-12 items-end mb-24">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-3 text-primary">
            <Satellite size={18} strokeWidth={3} className="animate-pulse" />
            <span className="font-mono font-black text-[10px] tracking-[0.5em] uppercase opacity-70">
              Station_Status: ACTIVE // {new Date().toLocaleDateString()}
            </span>
          </div>
          
          {/* Straight & Heavy LEET_SPACE Branding */}
          <h1 className="text-7xl md:text-9xl font-black uppercase font-display tracking-tight leading-[0.8] text-white">
            LEET <br /> 
            <span className="text-primary">SPACE</span><span className="text-white/20">.</span>
          </h1>
          
          <p className="max-w-xl text-slate-500 font-mono text-[11px] font-bold uppercase tracking-widest leading-relaxed border-l-2 border-primary/20 pl-8">
            Connection established. Synchronizing orbital logic modules. Access the central processing unit to begin simulation protocols.
          </p>
        </motion.div>

        {/* 2. Hardware Telemetry Cards (Right Side) */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:flex justify-end gap-6"
        >
          {/* Total Modules Card */}
          <div className="p-8 bg-white/[0.03] border-2 border-white/5 rounded-2xl backdrop-blur-md w-60 transition-all hover:border-primary/40 hover:bg-white/[0.05] group shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <Zap className="text-primary mb-4 group-hover:scale-110 transition-transform" size={32} strokeWidth={2.5} />
            <div className="text-5xl font-black font-display text-white tracking-tight leading-none mb-3">
              {problems?.length || 0}
            </div>
            <div className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-[0.4em]">
              Active_Modules
            </div>
          </div>

          {/* System Status Card */}
          <div className="p-8 bg-white/[0.03] border-2 border-white/5 rounded-2xl backdrop-blur-md w-60 transition-all hover:border-primary/40 hover:bg-white/[0.05] group shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <Activity className="text-primary mb-4 group-hover:scale-110 transition-transform" size={32} strokeWidth={2.5} />
            <div className="text-5xl font-black font-display text-emerald-500 tracking-tight leading-none mb-3">
              NOMINAL
            </div>
            <div className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-[0.4em]">
              Station_Sync
            </div>
          </div>
        </motion.div>
      </div>

      {/* 3. Main Data Sector (Module Table) */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        {/* Massive Ghost Database Icon */}
        <div className="absolute -top-20 -right-20 opacity-[0.015] pointer-events-none text-white">
          <Database size={600} strokeWidth={1} />
        </div>

        <div className="bg-[#080808] border-2 border-white/5 rounded-[2.5rem] p-6 md:p-12 backdrop-blur-xl shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden">
          <div className="flex items-center justify-between mb-16 border-b border-white/5 pb-8">
             <div className="flex items-center gap-6">
                <div className="h-10 w-[3px] bg-primary" />
                <h3 className="text-[12px] font-mono font-black tracking-[0.6em] uppercase text-slate-400">
                  Central_Manifest // Module_Index
                </h3>
             </div>
             <div className="px-5 py-2 rounded-lg border-2 border-white/5 bg-white/[0.02] hidden md:block">
                <span className="text-[9px] font-mono font-black text-primary uppercase tracking-[0.3em]">
                  ENCRYPTION_LEVEL: OMEGA_7
                </span>
             </div>
          </div>

          {problems && problems.length > 0 ? (
            <ProblemsTable problems={problems} />
          ) : (
            <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
              <Satellite size={64} className="text-slate-800 mb-6" strokeWidth={1} />
              <p className="text-slate-700 font-mono font-black uppercase tracking-[0.6em] text-xs">
                Signal_Lost: No_Active_Nodes_Detected
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Bottom Technical Corner Detail */}
      <div className="mt-12 flex justify-between items-center opacity-10 px-4">
        <div className="flex gap-4">
          <div className="h-1 w-20 bg-primary" />
          <div className="h-1 w-10 bg-white/40" />
        </div>
        <span className="text-[8px] font-mono font-black tracking-[1em] uppercase">LeetSpace_v4.0.0_Orbital</span>
      </div>

    </section>
  );
};

export default HomePage;