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
      <div className="h-full flex flex-col items-center justify-center bg-[#050505] font-mono">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse rounded-full" />
          <Loader2 className="size-16 animate-spin relative z-10 text-primary stroke-[3px]" />
        </div>
        <p className="mt-8 text-[11px] font-black tracking-[0.6em] uppercase text-primary/60">
          Syncing_Station_Archive...
        </p>
      </div>
    );
  }

  return (
    <section className="h-full w-full px-4 md:px-8 py-8 md:py-12">
      
      {/* 1. Hero Section: Orbital Command Center */}
      <div className="grid lg:grid-cols-2 gap-12 items-end mb-16">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-3 text-primary">
            <Satellite size={16} strokeWidth={3} className="animate-pulse" />
            <span className="font-mono font-black text-[11px] tracking-[0.5em] uppercase opacity-80">
              Station_Status: ACTIVE // {new Date().toLocaleDateString('en-GB')}
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase font-display tracking-tight leading-[0.9] text-white">
            LEET <br /> 
            <span className="text-primary">SPACE</span><span className="text-white/20">.</span>
          </h1>
          
          {/* CONTRAST: Bumped from slate-500 to slate-300 for readability */}
          <p className="max-w-xl text-slate-200 font-mono text-xs md:text-sm font-medium uppercase tracking-[0.2em] leading-relaxed border-l-4 border-primary/60 pl-8 opacity-90">
            Connection established. Synchronizing orbital logic modules. 
            Access the central processing unit to begin simulation protocols.
          </p>
        </motion.div>

        {/* 2. Hardware Telemetry Cards */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:flex flex-wrap justify-end gap-6"
        >
          {/* Total Modules Card */}
          <div className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-md flex-1 min-w-[180px] max-w-[240px] transition-all hover:border-primary/40 hover:bg-white/[0.05] group shadow-2xl">
            <Zap className="text-primary mb-4 group-hover:scale-110 transition-transform" size={28} strokeWidth={2.5} />
            <div className="text-4xl font-black font-display text-white tracking-tight mb-2">
              {problems?.length || 0}
            </div>
            <div className="text-[11px] font-mono font-black text-slate-400 uppercase tracking-[0.3em]">
              Active_Modules
            </div>
          </div>

          {/* System Status Card */}
          <div className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-md flex-1 min-w-[180px] max-w-[240px] transition-all hover:border-primary/40 hover:bg-white/[0.05] group shadow-2xl">
            <Activity className="text-primary mb-4 group-hover:scale-110 transition-transform" size={28} strokeWidth={2.5} />
            <div className="text-4xl font-black font-display text-emerald-500 tracking-tight mb-2 uppercase">
              Nominal
            </div>
            <div className="text-[11px] font-mono font-black text-slate-400 uppercase tracking-[0.3em]">
              Station_Sync
            </div>
          </div>
        </motion.div>
      </div>

      {/* 3. Main Data Sector (Module Table) */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        {/* FIXED: Clamped ghost icon to prevent overflow-x width bugs */}
        <div className="absolute -top-10 -right-10 opacity-[0.015] pointer-events-none text-white select-none hidden md:block">
          <Database size={400} strokeWidth={1} />
        </div>

        <div className="bg-[#080808] border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-xl shadow-2xl relative z-10">
          <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-6">
             <div className="flex items-center gap-5">
                <div className="h-8 w-[2px] bg-primary" />
                <h3 className="text-[10px] font-mono font-black tracking-[0.5em] uppercase text-slate-300">
                  Central_Manifest // Module_Index
                </h3>
             </div>
             <div className="px-4 py-1.5 rounded-lg border border-white/10 bg-white/[0.02] hidden md:block">
                <span className="text-[11px] font-mono font-black text-primary uppercase tracking-[0.4em]">
                  ENCRYPTION_LVL: OMEGA_7
                </span>
             </div>
          </div>

          {/* TABLE CONTAINER: Ensure it's responsive */}
          <div className="w-full overflow-x-auto">
            {problems && problems.length > 0 ? (
              <ProblemsTable problems={problems} />
            ) : (
              <div className="flex flex-col items-center justify-center py-32 border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
                <Satellite size={48} className="text-slate-800 mb-4" strokeWidth={1} />
                <p className="text-slate-400 font-mono font-black uppercase tracking-[0.5em] text-[10px]">
                  Signal_Lost: No_Active_Nodes_Detected
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Bottom Technical Corner Detail */}
      <div className="mt-12 flex justify-between items-center opacity-20 px-2">
        <div className="flex gap-3">
          <div className="h-[2px] w-12 bg-primary" />
          <div className="h-[2px] w-6 bg-white/40" />
        </div>
        <span className="text-[11px] font-mono font-black tracking-[1em] uppercase">LeetSpace_v4.0.0_Orbital</span>
      </div>

    </section>
  );
};

export default HomePage;