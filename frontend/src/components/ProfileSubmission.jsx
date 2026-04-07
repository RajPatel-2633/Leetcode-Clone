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
    <div className="space-y-10">
      {/* 1. Dashboard Controls: Heavy & Straight */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2">
           <h2 className="text-3xl font-black uppercase font-display tracking-tight text-white leading-none">Execution_History</h2>
           <p className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.4em]">Sector: User_Submissions // Archive_Log</p>
        </div>

        <div className="flex flex-wrap items-center gap-6 w-full md:w-auto">
          {/* Status Filter: Terminal Style */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="bg-white/[0.03] border-2 border-white/5 px-6 py-3 rounded-xl text-[10px] font-mono font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-white/10 transition-all">
              <Filter size={14} className="text-primary" />
              {filter === 'all' ? 'Filter_By: ALL_ENTRIES' : `Status: ${filter.replace(' ', '_').toUpperCase()}`}
            </div>
            <ul tabIndex={0} className="dropdown-content z-20 menu p-2 shadow-2xl bg-[#080808] border-2 border-white/10 rounded-2xl w-60 mt-4 backdrop-blur-xl">
              {['all', 'Accepted', 'Wrong Answer', 'Time Limit Exceeded'].map(f => (
                <li key={f}>
                  <button 
                    onClick={() => setFilter(f)} 
                    className="text-[10px] font-mono font-black uppercase tracking-widest hover:text-primary py-3 transition-colors"
                  >
                    {f === 'all' ? 'MANIFEST: SHOW_ALL' : `QUERY: ${f.toUpperCase()}`}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Stats Mini-Bar */}
          <div className="flex items-center gap-6 bg-white/[0.03] border-2 border-white/5 px-8 py-3 rounded-2xl shadow-xl">
            <div className="text-left border-r-2 border-white/5 pr-6">
              <p className="text-[8px] font-mono font-black text-slate-600 uppercase tracking-widest mb-1">TOTAL_LOGS</p>
              <p className="text-xl font-black font-display text-white">{submissions.length}</p>
            </div>
            <div className="text-left">
              <p className="text-[8px] font-mono font-black text-slate-600 uppercase tracking-widest mb-1">SUCCESS_RATE</p>
              <p className="text-xl font-black font-display text-emerald-400">
                {submissions.filter(s => s.status === 'Accepted').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.length === 0 ? (
          <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
            <Activity size={48} className="mx-auto text-slate-800 mb-6" />
            <p className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-slate-700">No logs detected in this sector.</p>
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
                className={`group border-2 transition-all duration-500 rounded-[2rem] overflow-hidden ${
                  isExpanded ? 'bg-white/[0.05] border-primary/40 shadow-[0_0_50px_rgba(0,0,0,0.6)]' : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                }`}
              >
                {/* Entry Header */}
                <div 
                  className="p-6 flex flex-col md:flex-row justify-between items-center cursor-pointer gap-6"
                  onClick={() => setExpandedSubmission(isExpanded ? null : submission.id)}
                >
                  <div className="flex items-center gap-8 w-full md:w-auto">
                    <div className={`px-5 py-1.5 rounded-xl border-2 text-[10px] font-mono font-black uppercase tracking-[0.2em] flex items-center gap-3 ${getStatusStyles(submission.status)}`}>
                       {submission.status === 'Accepted' ? <CheckCircle2 size={16} strokeWidth={3}/> : <XCircle size={16} strokeWidth={3}/>}
                       {submission.status.toUpperCase().replace(' ', '_')}
                    </div>
                    
                    <div className="flex items-center gap-3 text-white/80 font-display font-black text-sm uppercase tracking-tight">
                       <Code2 size={18} className="text-primary" strokeWidth={2.5} />
                       {submission.language}
                    </div>
                  </div>

                  <div className="flex items-center gap-10 w-full md:w-auto justify-between md:justify-end">
                    <div className="flex items-center gap-3 text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest">
                       <Clock size={16} />
                       {new Date(submission.createdAt).toLocaleDateString()}
                    </div>
                    <motion.div 
                      animate={{ rotate: isExpanded ? 180 : 0 }} 
                      className={`p-2 rounded-lg border-2 transition-all ${isExpanded ? 'bg-primary/20 border-primary/40' : 'bg-white/5 border-white/5'}`}
                    >
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
                      className="border-t-2 border-white/5 bg-black/60"
                    >
                      <div className="p-8 md:p-12 space-y-10">
                        {/* Metrics Row: Hardware Module Style */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                           <div className="bg-black/40 border-2 border-white/5 p-6 rounded-[1.5rem] flex items-center justify-between shadow-inner">
                              <div className="flex items-center gap-4">
                                <Zap size={20} className="text-primary" strokeWidth={3} />
                                <span className="text-[11px] font-mono font-black uppercase tracking-[0.3em] text-slate-500">Latency_Stream</span>
                              </div>
                              <span className="font-mono text-base font-black text-blue-400">{timeData[0] || 'VOID_MS'}</span>
                           </div>
                           <div className="bg-black/40 border-2 border-white/5 p-6 rounded-[1.5rem] flex items-center justify-between shadow-inner">
                              <div className="flex items-center gap-4">
                                <HardDrive size={20} className="text-primary" strokeWidth={3} />
                                <span className="text-[11px] font-mono font-black uppercase tracking-[0.3em] text-slate-500">Memory_Load</span>
                              </div>
                              <span className="font-mono text-base font-black text-purple-400">{memoryData[0] || 'VOID_KB'}</span>
                           </div>
                        </div>

                        {/* Source Buffer */}
                        <div className="space-y-4">
                           <div className="flex items-center gap-4">
                              <div className="h-px w-10 bg-primary/40" />
                              <span className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-slate-500">Source_Buffer_Snapshot</span>
                           </div>
                           <div className="relative bg-[#080808] border-2 border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                              <pre className="p-8 text-[13px] font-mono text-blue-300/80 leading-relaxed overflow-x-auto custom-scrollbar">
                                <code>{submission.sourceCode}</code>
                              </pre>
                              <div className="absolute top-4 right-4 text-[8px] font-mono font-black text-white/10 uppercase tracking-widest">
                                Read_Only_Access
                              </div>
                           </div>
                        </div>

                        {/* Stdin/Stdout Split */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                           <div className="space-y-3">
                              <span className="text-[9px] font-mono font-black text-slate-700 uppercase tracking-[0.4em] ml-2">Input_Pipe_Data</span>
                              <div className="bg-black/80 p-6 rounded-2xl border-2 border-white/5 text-[12px] font-mono text-slate-500 leading-none">
                                 {submission.stdin || 'NULL_SIGNAL'}
                              </div>
                           </div>
                           <div className="space-y-3">
                              <span className="text-[9px] font-mono font-black text-slate-700 uppercase tracking-[0.4em] ml-2">Stdout_Return_Stream</span>
                              <div className="bg-black/80 p-6 rounded-2xl border-2 border-white/5 text-[12px] font-mono text-emerald-500/80 leading-none">
                                 {Array.isArray(safeParse(submission.stdout)) 
                                    ? safeParse(submission.stdout).join('') 
                                    : submission.stdout || 'STREAM_EMPTY'}
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