import React, { useEffect } from 'react';
import { useProblemStore } from '../store/useProblemStore';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Tag, 
  CheckCircle2, 
  Zap, 
  Terminal, 
  BarChart3,
  ChevronRight
} from 'lucide-react';

const ProblemSolvedByUser = () => {
  const { getSolvedProblemByUser, solvedProblems } = useProblemStore();

  useEffect(() => {
    getSolvedProblemByUser();
  }, [getSolvedProblemByUser]);

  const difficultyStyles = {
    EASY: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    MEDIUM: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    HARD: "text-rose-400 bg-rose-400/10 border-rose-400/20",
  };

  const getStats = () => {
    const easy = solvedProblems.filter(p => p.difficulty === 'EASY').length;
    const medium = solvedProblems.filter(p => p.difficulty === 'MEDIUM').length;
    const hard = solvedProblems.filter(p => p.difficulty === 'HARD').length;
    const total = solvedProblems.length;
    return { easy, medium, hard, total };
  };

  const stats = getStats();

  return (
    <div className="space-y-12">
      {/* 1. Progress Telemetry Header */}
      {solvedProblems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 bg-white/[0.03] border-2 border-white/5 p-8 rounded-[2rem] flex flex-col justify-center">
            <p className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-slate-600 mb-2">Solved_Modules</p>
            <h3 className="text-5xl font-black font-display text-primary tracking-tight leading-none">{stats.total}</h3>
          </div>
          
          <div className="md:col-span-3 bg-white/[0.03] border-2 border-white/5 p-8 rounded-[2rem] flex flex-col justify-center">
            <div className="flex justify-between items-end mb-6">
               <div className="flex items-center gap-3">
                 <BarChart3 size={18} className="text-primary" />
                 <span className="text-[11px] font-mono font-black uppercase tracking-[0.3em] text-slate-400">Difficulty_Distribution</span>
               </div>
               <div className="flex gap-6 text-[11px] font-mono font-black uppercase tracking-widest">
                 <span className="text-emerald-400/80">E: {stats.easy}</span>
                 <span className="text-amber-400/80">M: {stats.medium}</span>
                 <span className="text-rose-400/80">H: {stats.hard}</span>
               </div>
            </div>
            {/* Visual Progress Bar - Heavy & Blocky */}
            <div className="h-4 w-full bg-white/5 rounded-lg overflow-hidden flex border border-white/10 p-0.5">
               <motion.div initial={{ width: 0 }} animate={{ width: `${(stats.easy/stats.total)*100}%` }} className="bg-emerald-500 h-full rounded-sm mr-0.5" />
               <motion.div initial={{ width: 0 }} animate={{ width: `${(stats.medium/stats.total)*100}%` }} className="bg-amber-500 h-full rounded-sm mr-0.5" />
               <motion.div initial={{ width: 0 }} animate={{ width: `${(stats.hard/stats.total)*100}%` }} className="bg-rose-500 h-full rounded-sm" />
            </div>
          </div>
        </div>
      )}

      {/* 2. Solved Modules Feed */}
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-2">
            <div className="h-px w-8 bg-primary/40" />
            <span className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-slate-600">Execution_History</span>
        </div>
        
        {solvedProblems.length === 0 ? (
          <div className="py-24 text-center bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[3rem]">
            <Terminal size={48} className="mx-auto text-slate-800 mb-6" />
            <p className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-slate-600">No logs detected in this sector.</p>
            <Link to="/" className="inline-block mt-8 px-8 py-3 bg-white/5 hover:bg-primary text-white hover:text-black border border-white/10 transition-all text-[10px] font-black uppercase tracking-[0.3em] rounded-xl">
              Access_Global_Index
            </Link>
          </div>
        ) : (
          solvedProblems.map((problem, index) => (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group flex flex-col md:flex-row items-center justify-between p-6 bg-white/[0.02] hover:bg-white/[0.04] border-2 border-white/5 hover:border-primary/40 rounded-3xl transition-all duration-500"
            >
              <div className="flex items-center gap-8 w-full md:w-auto">
                <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border-2 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  <CheckCircle2 size={24} strokeWidth={3} />
                </div>
                <div>
                  <h4 className="text-xl font-black font-display tracking-tight text-white group-hover:text-primary transition-colors uppercase leading-none">
                    {problem.title}
                  </h4>
                  <div className="flex gap-4 mt-3">
                    {problem.tags?.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-600 flex items-center gap-2 border-b border-white/5 pb-0.5">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 w-full md:w-auto mt-6 md:mt-0 justify-between md:justify-end">
                <span className={`px-5 py-1.5 rounded-xl text-[10px] font-mono font-black tracking-[0.2em] border-2 uppercase ${difficultyStyles[problem.difficulty]}`}>
                  {problem.difficulty}
                </span>

                <Link 
                  to={`/problem/${problem.id}`} 
                  className="p-4 bg-white/5 hover:bg-primary text-slate-500 hover:text-black rounded-2xl border-2 border-transparent transition-all shadow-xl group/btn"
                >
                  <ChevronRight size={20} strokeWidth={3} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* 3. Global Action Footer */}
      <div className="flex justify-center pt-8 border-t border-white/5">
          <Link to="/" className="group flex items-center gap-4 px-10 py-5 bg-white/[0.03] hover:bg-primary border-2 border-white/10 hover:border-primary rounded-2xl transition-all shadow-2xl">
            <Zap size={18} className="text-primary group-hover:text-black group-hover:scale-125 transition-all" />
            <span className="text-[11px] font-mono font-black uppercase tracking-[0.4em] text-slate-400 group-hover:text-black">Sync_New_Challenges</span>
          </Link>
      </div>
    </div>
  );
};

export default ProblemSolvedByUser;