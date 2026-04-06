import React, { useEffect } from 'react';
import { useProblemStore } from '../store/useProblemStore';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Tag, 
  ExternalLink, 
  CheckCircle2, 
  Circle, 
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
    <div className="space-y-10">
      {/* 1. Progress Telemetry Header */}
      {solvedProblems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1 bg-white/[0.03] border border-white/5 p-6 rounded-3xl flex flex-col justify-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Solved_Modules</p>
            <h3 className="text-4xl font-black italic text-primary tracking-tighter">{stats.total}</h3>
          </div>
          
          <div className="md:col-span-3 bg-white/[0.03] border border-white/5 p-6 rounded-3xl">
            <div className="flex justify-between items-end mb-4">
               <div className="flex items-center gap-2">
                 <BarChart3 size={16} className="text-slate-500" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Difficulty_Distribution</span>
               </div>
               <div className="flex gap-4 text-[10px] font-black uppercase tracking-tighter">
                 <span className="text-emerald-400">E: {stats.easy}</span>
                 <span className="text-amber-400">M: {stats.medium}</span>
                 <span className="text-rose-400">H: {stats.hard}</span>
               </div>
            </div>
            {/* Visual Progress Bar */}
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex">
               <motion.div initial={{ width: 0 }} animate={{ width: `${(stats.easy/stats.total)*100}%` }} className="bg-emerald-400 h-full" />
               <motion.div initial={{ width: 0 }} animate={{ width: `${(stats.medium/stats.total)*100}%` }} className="bg-amber-400 h-full" />
               <motion.div initial={{ width: 0 }} animate={{ width: `${(stats.hard/stats.total)*100}%` }} className="bg-rose-400 h-full" />
            </div>
          </div>
        </div>
      )}

      {/* 2. Solved Modules Feed */}
      <div className="space-y-3">
        {solvedProblems.length === 0 ? (
          <div className="py-16 text-center bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[2.5rem]">
            <Terminal size={40} className="mx-auto text-slate-700 mb-4" />
            <p className="text-xs font-black uppercase tracking-widest text-slate-500 italic">No modules solved in this sector.</p>
            <Link to="/" className="btn btn-link btn-primary no-underline mt-4 uppercase text-[10px] font-black tracking-widest">
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
              className="group flex flex-col md:flex-row items-center justify-between p-5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-primary/30 rounded-2xl transition-all duration-300"
            >
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="size-10 rounded-xl bg-emerald-400/10 flex items-center justify-center text-emerald-400 border border-emerald-400/20">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-bold tracking-tight text-white group-hover:text-primary transition-colors">
                    {problem.title}
                  </h4>
                  <div className="flex gap-2 mt-1">
                    {problem.tags?.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
                        <Tag size={8} /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto mt-4 md:mt-0 justify-between md:justify-end">
                <span className={`px-4 py-1 rounded-lg text-[9px] font-black tracking-widest border uppercase ${difficultyStyles[problem.difficulty]}`}>
                  {problem.difficulty}
                </span>

                <Link 
                  to={`/problem/${problem.id}`} 
                  className="p-3 bg-white/5 hover:bg-primary text-slate-400 hover:text-black rounded-xl transition-all shadow-lg group/btn"
                >
                  <ChevronRight size={18} className="group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* 3. Global Action Footer */}
      <div className="flex justify-center pt-4">
         <Link to="/" className="group flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all">
            <Zap size={16} className="text-primary group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Sync_New_Challenges</span>
         </Link>
      </div>
    </div>
  );
};

export default ProblemSolvedByUser;