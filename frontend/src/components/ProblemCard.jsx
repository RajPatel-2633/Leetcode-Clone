import React from "react";
import { motion } from "framer-motion";
import { Terminal, ArrowRight, Zap } from "lucide-react";

const difficultyStyles = {
  EASY: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  MEDIUM: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  HARD: "text-rose-400 bg-rose-400/10 border-rose-400/20",
};

const ProblemCard = ({ problem, onSelect }) => {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.01 }}
      className="relative group bg-white/[0.02] hover:bg-white/[0.04] border-2 border-white/5 hover:border-primary/40 rounded-[2rem] p-8 transition-all duration-500 overflow-hidden shadow-2xl h-full flex flex-col"
    >
      {/* 1. Technical Grid Overlay (Subtle) */}
      <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />

      <div className="relative z-10 flex flex-col h-full">
        {/* 2. Header: Difficulty & Metadata */}
        <div className="flex justify-between items-start mb-8">
          <span className={`text-[11px] font-mono font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-xl border-2 ${difficultyStyles[problem.difficulty]}`}>
            {problem.difficulty}
          </span>
          <div className="flex flex-wrap gap-2 justify-end">
            {problem.tags.slice(0, 2).map((tag, index) => (
              <span 
                key={index} 
                className="text-[11px] font-mono font-black uppercase tracking-widest bg-white/5 text-slate-400 px-3 py-1.5 rounded-lg border-2 border-white/5"
              >
                #{tag}
              </span>
            ))}
            {problem.tags.length > 2 && (
              <span className="text-[11px] font-mono font-black text-primary/40 px-2 py-1.5 uppercase tracking-widest">
                +{problem.tags.length - 2}_NODES
              </span>
            )}
          </div>
        </div>
        
        {/* 3. Title & Description */}
        <div className="mb-6">
            {/* UPDATED: Removed italic, added font-display and font-black */}
            <h3 className="text-2xl font-black tracking-tight text-white group-hover:text-primary transition-colors uppercase font-display leading-[0.9]">
              {problem.title}
            </h3>
            <div className="h-1 w-12 bg-primary/20 mt-4 group-hover:w-24 group-hover:bg-primary transition-all duration-700" />
        </div>
        
        <p className="text-[13px] text-slate-400 leading-relaxed line-clamp-3 mb-10 font-bold uppercase tracking-tight">
          {problem.description}
        </p>
        
        {/* 4. Action Button: Command Interface */}
        <button
          onClick={onSelect}
          className="mt-auto w-full bg-white/[0.03] hover:bg-primary border-2 border-white/5 hover:border-primary py-5 rounded-2xl flex items-center justify-center gap-4 transition-all duration-500 group/btn shadow-xl"
        >
          <Terminal size={16} strokeWidth={3} className="text-primary group-hover/btn:text-black transition-colors" />
          <span className="text-[11px] font-mono font-black uppercase tracking-[0.4em] text-white group-hover/btn:text-black">
            Initialize_Module
          </span>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover/btn:text-black group-hover/btn:translate-x-2 transition-all" />
        </button>
      </div>

      {/* Industrial Background Mark */}
      <div className="absolute -bottom-4 -left-4 font-mono font-black text-[60px] text-white/[0.015] select-none pointer-events-none group-hover:text-primary/5 transition-colors">
        0x{problem.difficulty.charAt(0)}
      </div>
    </motion.div>
  );
};

export default ProblemCard;