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
      <div className="flex justify-center items-center p-20">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <Database className="text-primary size-10 opacity-50" />
        </motion.div>
      </div>
    );
  }

  if (!submissions?.length) {
    return (
      <div className="text-center p-20 bg-white/[0.02] border border-dashed border-white/5 rounded-3xl">
        <Terminal className="mx-auto text-slate-700 mb-4" size={40} />
        <p className="text-xs font-black uppercase tracking-widest text-slate-500 italic">No execution logs found in this sector.</p>
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
    <div className="space-y-6">
      {/* 1. Controller Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/[0.03] p-4 rounded-2xl border border-white/5">
        <div className="flex items-center gap-3">
          <Filter size={14} className="text-primary" />
          <select
            className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all" className="bg-[#121212]">All_Status</option>
            <option value="Accepted" className="bg-[#121212]">Accepted</option>
            <option value="Wrong Answer" className="bg-[#121212]">Wrong_Answer</option>
            <option value="Time Limit Exceeded" className="bg-[#121212]">TLE_Error</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <ArrowUpDown size={14} className="text-primary" />
          <select
            className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer text-right"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest" className="bg-[#121212]">Sort: Newest</option>
            <option value="oldest" className="bg-[#121212]">Sort: Oldest</option>
          </select>
        </div>
      </div>

      {/* 2. Log Feed */}
      <div className="space-y-3">
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
              className={`group overflow-hidden rounded-2xl border transition-all duration-300 ${
                isExpanded ? "bg-white/[0.05] border-primary/30 shadow-2xl" : "bg-white/[0.02] border-white/5 hover:border-white/10"
              }`}
            >
              <div 
                className="p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer"
                onClick={() => setExpandedSubmissionId(isExpanded ? null : submission.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={submission.status === "Accepted" ? "text-emerald-400" : "text-rose-400"}>
                    {submission.status === "Accepted" ? <CheckCircle2 size={22} /> : <XCircle size={22} />}
                  </div>
                  <div>
                    <h4 className={`text-sm font-black uppercase tracking-tight italic ${submission.status === "Accepted" ? "text-white" : "text-rose-400/80"}`}>
                        {submission.status}
                    </h4>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Compiler: {submission.language}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="hidden md:flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5"><Clock size={12}/> {avgTime.toFixed(3)}s</div>
                    <div className="flex items-center gap-1.5"><Memory size={12}/> {avgMem.toFixed(0)}KB</div>
                    <div className="flex items-center gap-1.5"><Calendar size={12}/> {new Date(submission.createdAt).toLocaleDateString()}</div>
                  </div>
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                    <ChevronDown size={18} className="text-slate-600 group-hover:text-primary transition-colors" />
                  </motion.div>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/5 bg-black/40"
                  >
                    <div className="p-6 space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                          <Code2 size={12} className="text-primary" /> Source_Snapshot
                        </div>
                        <div className="relative bg-[#0d0d0d] rounded-xl border border-white/5 overflow-hidden">
                          <pre className="p-4 text-xs font-mono text-blue-300 overflow-x-auto custom-scrollbar leading-relaxed">
                            <code>{submission.sourceCode}</code>
                          </pre>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <span className="text-[8px] font-black uppercase text-slate-600 tracking-widest ml-1">Stdin_Buffer</span>
                           <div className="bg-black/60 p-4 rounded-xl border border-white/5 text-[11px] font-mono text-slate-400 min-h-[60px]">
                              {submission.stdin || "VOID"}
                           </div>
                        </div>
                        <div className="space-y-2">
                           <span className="text-[8px] font-black uppercase text-slate-600 tracking-widest ml-1">Stdout_Pipe</span>
                           <div className="bg-black/60 p-4 rounded-xl border border-white/5 text-[11px] font-mono text-emerald-400 min-h-[60px]">
                              {Array.isArray(safeParse(submission.stdout))
                                ? safeParse(submission.stdout).join("")
                                : submission.stdout || "VOID"}
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