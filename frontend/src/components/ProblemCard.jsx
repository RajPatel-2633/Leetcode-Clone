import React from "react";
import { motion } from "framer-motion";
import { Terminal, ArrowRight, Zap, Tag as TagIcon } from "lucide-react";

const difficultyStyles = {
  EASY: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  MEDIUM: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  HARD: "text-rose-400 bg-rose-400/10 border-rose-400/20",
};

const ProblemCard = ({ problem, onSelect }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative group bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-primary/30 rounded-[2rem] p-6 transition-all duration-500 overflow-hidden shadow-2xl h-full flex flex-col"
    >
      {/* 1. Ambient Background Glow (Hover only) */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        {/* 2. Header: Difficulty & Metadata */}
        <div className="flex justify-between items-start mb-5">
          <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg border ${difficultyStyles[problem.difficulty]}`}>
            {problem.difficulty}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {problem.tags.slice(0, 2).map((tag, index) => (
              <span 
                key={index} 
                className="text-[8px] font-black uppercase tracking-widest bg-white/5 text-slate-500 px-2 py-1 rounded-md border border-white/5"
              >
                {tag}
              </span>
            ))}
            {problem.tags.length > 2 && (
              <span className="text-[8px] font-black text-primary/60 px-2 py-1 uppercase tracking-widest">
                +{problem.tags.length - 2}_MORE
              </span>
            )}
          </div>
        </div>
        
        {/* 3. Title & Description */}
        <div className="mb-4">
            <h3 className="text-xl font-black tracking-tight text-white group-hover:text-primary transition-colors italic uppercase leading-tight">
              {problem.title}
            </h3>
            <div className="h-0.5 w-8 bg-primary/30 mt-2 group-hover:w-16 transition-all duration-500" />
        </div>
        
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-8 font-medium">
          {problem.description}
        </p>
        
        {/* 4. Action Button: Themed as a Command */}
        <button
          onClick={onSelect}
          className="mt-auto w-full bg-white/5 hover:bg-primary border border-white/10 hover:border-primary py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 group/btn"
        >
          <Terminal size={14} className="text-primary group-hover/btn:text-black transition-colors" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white group-hover/btn:text-black">
            Initialize_Module
          </span>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover/btn:text-black group-hover/btn:translate-x-1 transition-all" />
        </button>
      </div>

      {/* Decorative Corner Element */}
      <Zap size={40} className="absolute -bottom-2 -right-2 text-white/[0.02] group-hover:text-primary/10 transition-colors pointer-events-none" />
    </motion.div>
  );
};

export default ProblemCard;