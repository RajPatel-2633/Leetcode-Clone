import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSubmissionStore } from '../store/useSubmissionStore';
import { 
  Code2, Terminal, Clock, HardDrive, CheckCircle2, 
  XCircle, ChevronDown, Filter, Zap, Activity 
} from 'lucide-react';

const ProfileSubmission = () => {
  const { submissions } = useSubmissionStore();
  const [expandedSubmission, setExpandedSubmission] = useState(null);
  const [filter, setFilter] = useState('all');

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Accepted': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Wrong Answer': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      case 'Time Limit Exceeded': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    }
  };

  const safeParse = (data) => {
    try { return JSON.parse(data || '[]'); } 
    catch (e) { return []; }
  };

  const filteredSubmissions = submissions.filter(s => filter === 'all' || s.status === filter);

  return (
    <div className="space-y-8">
      {/* 1. Dashboard Controls */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-1">
           <h2 className="text-2xl font-black italic uppercase tracking-tighter">Execution_History</h2>
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sector: User_Submissions</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* Status Filter */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all">
              <Filter size={14} className="text-primary" />
              {filter === 'all' ? 'All_Entries' : filter.replace(' ', '_')}
            </div>
            <ul tabIndex={0} className="dropdown-content z-20 menu p-2 shadow-2xl bg-[#121212] border border-white/10 rounded-2xl w-52 mt-2">
              {['all', 'Accepted', 'Wrong Answer', 'Time Limit Exceeded'].map(f => (
                <li key={f}>
                  <button 
                    onClick={() => setFilter(f)} 
                    className="text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors"
                  >
                    {f === 'all' ? 'Show_All' : f}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Stats Mini-Bar */}
          <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 px-6 py-2 rounded-2xl">
            <div className="text-center border-r border-white/5 pr-4">
              <p className="text-[8px] font-black text-slate-500 uppercase">Total</p>
              <p className="text-sm font-black italic text-white">{submissions.length}</p>
            </div>
            <div className="text-center">
              <p className="text-[8px] font-black text-slate-500 uppercase">Success</p>
              <p className="text-sm font-black italic text-emerald-400">
                {submissions.filter(s => s.status === 'Accepted').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
            <Activity size={40} className="mx-auto text-slate-700 mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">No logs detected in this sector.</p>
          </div>
        ) : (
          filteredSubmissions.map((submission, index) => {
            const isExpanded = expandedSubmission === submission.id;
            const timeData = safeParse(submission.time);
            const memoryData = safeParse(submission.memory);

            return (
              <motion.div
                key={submission.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`group border transition-all duration-500 rounded-[1.5rem] overflow-hidden ${
                  isExpanded ? 'bg-white/[0.04] border-primary/30 shadow-2xl' : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                }`}
              >
                {/* Entry Header */}
                <div 
                  className="p-5 flex flex-col md:flex-row justify-between items-center cursor-pointer gap-4"
                  onClick={() => setExpandedSubmission(isExpanded ? null : submission.id)}
                >
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className={`px-4 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${getStatusStyles(submission.status)}`}>
                       {submission.status === 'Accepted' ? <CheckCircle2 size={14}/> : <XCircle size={14}/>}
                       {submission.status}
                    </div>
                    
                    <div className="flex items-center gap-2 text-white/80 font-bold text-xs uppercase tracking-tight">
                       <Code2 size={16} className="text-primary" />
                       {submission.language}
                    </div>
                  </div>

                  <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                       <Clock size={14} />
                       {new Date(submission.createdAt).toLocaleDateString()}
                    </div>
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                      <ChevronDown size={20} className={isExpanded ? 'text-primary' : 'text-slate-600'} />
                    </motion.div>
                  </div>
                </div>

                {/* Expanded Telemetry & Source */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/5"
                    >
                      <div className="p-6 md:p-8 space-y-8">
                        {/* Metrics Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div className="bg-black/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Zap size={18} className="text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Latency</span>
                              </div>
                              <span className="font-mono text-sm text-blue-400">{timeData[0] || 'N/A'}</span>
                           </div>
                           <div className="bg-black/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <HardDrive size={18} className="text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Memory_Load</span>
                              </div>
                              <span className="font-mono text-sm text-purple-400">{memoryData[0] || 'N/A'}</span>
                           </div>
                        </div>

                        {/* Source Buffer */}
                        <div className="space-y-3">
                           <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                              <Terminal size={12} /> Source_Buffer_Snapshot
                           </div>
                           <div className="relative bg-[#0d0d0d] border border-white/5 rounded-2xl overflow-hidden group/code">
                              <pre className="p-6 text-xs font-mono text-blue-300/90 leading-relaxed overflow-x-auto custom-scrollbar">
                                <code>{submission.sourceCode}</code>
                              </pre>
                              {/* Overlay for depth */}
                              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/20" />
                           </div>
                        </div>

                        {/* Stdin/Stdout Split */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1">Input_Pipe</span>
                              <div className="bg-black/40 p-4 rounded-xl border border-white/5 text-[11px] font-mono text-slate-400">
                                 {submission.stdin || 'NULL'}
                              </div>
                           </div>
                           <div className="space-y-2">
                              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1">Stdout_Return</span>
                              <div className="bg-black/40 p-4 rounded-xl border border-white/5 text-[11px] font-mono text-emerald-400">
                                 {Array.isArray(safeParse(submission.stdout)) 
                                    ? safeParse(submission.stdout).join('') 
                                    : submission.stdout || 'VOID'}
                              </div>
                           </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProfileSubmission;