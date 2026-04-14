import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
  Calendar,
  ChevronDown,
  Terminal,
  Code2,
  Database,
  Filter,
  ArrowUpDown
} from "lucide-react";

const SubmissionsList = ({ submissions, isLoading }) => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [expandedSubmissionId, setExpandedSubmissionId] = useState(null);

  const safeParse = (data) => {
    try { return JSON.parse(data); } 
    catch (e) { return []; }
  };

  const calculateAverageMemory = (memoryData) => {
    const memoryArray = safeParse(memoryData).map((m) => parseFloat(m.split(" ")[0]));
    return memoryArray.length ? (memoryArray.reduce((a, b) => a + b, 0) / memoryArray.length) : 0;
  };

  const calculateAverageTime = (timeData) => {
    const timeArray = safeParse(timeData).map((t) => parseFloat(t.split(" ")[0]));
    return timeArray.length ? (timeArray.reduce((a, b) => a + b, 0) / timeArray.length) : 0;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-24">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <Database className="text-primary size-12 opacity-50" strokeWidth={3} />
        </motion.div>
      </div>
    );
  }

  if (!submissions?.length) {
    return (
      <div className="text-center p-24 bg-white/[0.01] border-2 border-dashed border-white/5 rounded-[2.5rem]">
        <Terminal className="mx-auto text-slate-800 mb-6" size={48} />
        <p className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-slate-400">
          No_Execution_Logs_Found_In_Sector
        </p>
      </div>
    );
  }

  const filteredSubmissions = submissions.filter((s) => statusFilter === "all" || s.status === statusFilter);
  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="space-y-8">
      {/* 1. Controller Bar: Straight & Heavy */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 bg-white/[0.02] p-6 rounded-2xl border-2 border-white/5">
        <div className="flex items-center gap-4 group">
          <Filter size={16} strokeWidth={3} className="text-primary" />
          <select
            className="bg-transparent text-[11px] font-mono font-black uppercase tracking-[0.3em] outline-none cursor-pointer text-slate-300 focus:text-primary transition-colors"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all" className="bg-[#080808]">STATUS: ALL_LOGS</option>
            <option value="Accepted" className="bg-[#080808]">STATUS: ACCEPTED</option>
            <option value="Wrong Answer" className="bg-[#080808]">STATUS: WRONG_ANSWER</option>
            <option value="Time Limit Exceeded" className="bg-[#080808]">STATUS: TLE_ERROR</option>
          </select>
        </div>
        <div className="flex items-center gap-4">
          <ArrowUpDown size={16} strokeWidth={3} className="text-primary" />
          <select
            className="bg-transparent text-[11px] font-mono font-black uppercase tracking-[0.3em] outline-none cursor-pointer text-right text-slate-300 focus:text-primary transition-colors"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest" className="bg-[#080808]">SORT: NEWEST_ENTRY</option>
            <option value="oldest" className="bg-[#080808]">SORT: OLDEST_ENTRY</option>
          </select>
        </div>
      </div>

      {/* 2. Log Feed */}
      <div className="space-y-4">
        {sortedSubmissions.map((submission, idx) => {
          const isExpanded = expandedSubmissionId === submission.id;
          const avgMem = calculateAverageMemory(submission.memory);
          const avgTime = calculateAverageTime(submission.time);

          return (
            <motion.div
              key={submission.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`group overflow-hidden rounded-[1.5rem] border-2 transition-all duration-500 shadow-xl ${
                isExpanded ? "bg-white/[0.05] border-primary/40 shadow-[0_0_40px_rgba(0,0,0,0.6)]" : "bg-white/[0.02] border-white/5 hover:border-white/10"
              }`}
            >
              <div 
                className="p-6 flex flex-wrap items-center justify-between gap-6 cursor-pointer"
                onClick={() => setExpandedSubmissionId(isExpanded ? null : submission.id)}
              >
                <div className="flex items-center gap-8">
                  <div className={submission.status === "Accepted" ? "text-emerald-400" : "text-rose-500"}>
                    {submission.status === "Accepted" ? <CheckCircle2 size={28} strokeWidth={3} /> : <XCircle size={28} strokeWidth={3} />}
                  </div>
                  <div className="space-y-1">
                    <h4 className={`text-lg font-black uppercase font-display tracking-tight leading-none ${submission.status === "Accepted" ? "text-white" : "text-rose-500/80"}`}>
                        {submission.status.replace(' ', '_')}
                    </h4>
                    <div className="flex items-center gap-2">
                       <Code2 size={12} className="text-primary" />
                       <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">Compiler: {submission.language}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-10">
                  <div className="hidden md:flex items-center gap-8 text-[11px] font-mono font-black text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-2"><Clock size={14} className="text-primary/50"/> {avgTime.toFixed(3)}s</div>
                    <div className="flex items-center gap-2"><Memory size={14} className="text-primary/50"/> {avgMem.toFixed(0)}KB</div>
                    <div className="flex items-center gap-2"><Calendar size={14} className="text-primary/50"/> {new Date(submission.createdAt).toLocaleDateString()}</div>
                  </div>
                  <motion.div 
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    className={`p-2 rounded-lg border-2 transition-all ${isExpanded ? 'bg-primary/20 border-primary/40' : 'bg-white/5 border-white/5'}`}
                  >
                    <ChevronDown size={18} strokeWidth={3} className={isExpanded ? "text-primary" : "text-slate-400"} />
                  </motion.div>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t-2 border-white/5 bg-black/60"
                  >
                    <div className="p-8 md:p-12 space-y-10">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="h-px w-10 bg-primary/40" />
                          <span className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-slate-400">
                            Source_Buffer_Snapshot
                          </span>
                        </div>
                        <div className="relative bg-[#080808] rounded-[1.5rem] border-2 border-white/5 overflow-hidden shadow-2xl">
                          <pre className="p-8 text-[13px] font-mono text-blue-300/80 overflow-x-auto custom-scrollbar leading-relaxed">
                            <code>{submission.sourceCode}</code>
                          </pre>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <span className="text-[11px] font-mono font-black uppercase text-slate-400 tracking-[0.4em] ml-2">Stdin_Pipe</span>
                           <div className="bg-black/80 p-6 rounded-2xl border-2 border-white/5 text-[12px] font-mono text-slate-400 min-h-[80px]">
                              {submission.stdin || "NULL_SIGNAL"}
                           </div>
                        </div>
                        <div className="space-y-3">
                           <span className="text-[11px] font-mono font-black uppercase text-slate-400 tracking-[0.4em] ml-2">Stdout_Return</span>
                           <div className="bg-black/80 p-6 rounded-2xl border-2 border-white/5 text-[12px] font-mono text-emerald-500/80 min-h-[80px]">
                              {Array.isArray(safeParse(submission.stdout))
                                ? safeParse(submission.stdout).join("")
                                : submission.stdout || "VOID_STREAM"}
                           </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SubmissionsList;