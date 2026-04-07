import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  FileText,
  MessageSquare,
  Lightbulb,
  Bookmark,
  Share2,
  ChevronRight,
  Terminal,
  Code2,
  Users,
  ThumbsUp,
  ArrowLeft,
  Zap,
  Loader2,
  Circle
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useProblemStore } from "../store/useProblemStore";
import { getLanguageId } from "../libs/utils";
import { useExecutionStore } from "../store/useExecution";
import { useSubmissionStore } from "../store/useSubmissionStore";
import Submission from "../components/Submission";
import SubmissionsList from "../components/SubmissionList";

const ProblemPage = () => {
  const { id } = useParams();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();
  const { submission: submissions, isLoading: isSubmissionsLoading, getSubmissionForProblem, getSubmissionCountForProblem, submissionCount } = useSubmissionStore();
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testCases, setTestCases] = useState([]);

  const { executeCode, submission, isExecuting } = useExecutionStore();

  useEffect(() => {
    getProblemById(id);
    getSubmissionCountForProblem(id);
  }, [id, getProblemById, getSubmissionCountForProblem]);

  useEffect(() => {
    if (problem) {
      setCode(problem.codeSnippets?.[selectedLanguage] || submission?.sourceCode || "");
      setTestCases(
        problem.testCases?.map((tc) => ({
          input: tc.input,
          output: tc.output,
        })) || []
      );
    }
  }, [problem, selectedLanguage, submission?.sourceCode]);

  useEffect(() => {
    if (activeTab === "submissions" && id) {
      getSubmissionForProblem(id);
    }
  }, [activeTab, id, getSubmissionForProblem]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setCode(problem.codeSnippets?.[lang] || "");
  };

  const handleRunCode = async () => {
    if (!code.trim()) return toast.error("ACCESS_DENIED: SOURCE_BUFFER_EMPTY");
    const languageId = getLanguageId(selectedLanguage);
    const stdin = testCases.map((tc) => tc.input);
    const expected_outputs = testCases.map((tc) => tc.output);
    await executeCode(code, languageId, stdin, expected_outputs, problem.id);
  };

  const handleSubmitSolution = async () => {
    await handleRunCode();
    setActiveTab("submissions");
    if (id) await getSubmissionForProblem(id);
  };

  if (isProblemLoading || !problem) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#050505]">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
          <Terminal size={64} strokeWidth={3} className="text-primary" />
        </div>
        <p className="mt-8 font-mono font-black uppercase tracking-[0.5em] text-[10px] text-primary/60">
          BOOTING_ENVIRONMENT // MOUNTING_DATA_SECTOR
        </p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6 overflow-hidden px-4 md:px-0">
      
      {/* 1. Header Hub: High-Density Control Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/[0.02] border-2 border-white/5 p-6 rounded-[1.5rem] backdrop-blur-md shrink-0 shadow-2xl">
          <div className="flex items-center gap-8">
            <Link to="/" className="p-3 bg-white/5 border-2 border-white/5 hover:border-primary/40 rounded-xl transition-all group">
              <ArrowLeft className="group-hover:-translate-x-1 transition-transform" strokeWidth={3} />
            </Link>
            <div className="space-y-1">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-black font-display uppercase tracking-tight text-white leading-none">
                  {problem.title}
                </h1>
                <span className={`text-[10px] px-3 py-1 font-mono font-black rounded-lg border-2 uppercase tracking-widest ${
                    problem.difficulty === "EASY" ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/5" : 
                    problem.difficulty === "MEDIUM" ? "text-amber-400 border-amber-400/20 bg-amber-400/5" : "text-rose-500 border-rose-500/20 bg-rose-500/5"
                }`}>{problem.difficulty}</span>
              </div>
              <div className="flex items-center gap-6 text-[9px] font-mono font-black text-slate-600 uppercase tracking-[0.3em]">
                <span className="flex items-center gap-2"><Users size={12}/> {submissionCount} ATTEMPTS_LOGGED</span>
                <span className="flex items-center gap-2"><ThumbsUp size={12}/> 95% SUCCESS_RATE</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <select 
                  className="bg-black/60 border-2 border-white/5 rounded-2xl px-6 py-3 text-[10px] font-mono font-black uppercase tracking-widest outline-none focus:border-primary/50 appearance-none cursor-pointer pr-10"
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
              >
                  {Object.keys(problem.codeSnippets || {}).map((lang) => (
                      <option key={lang} value={lang} className="bg-[#080808]">{lang.toUpperCase()}</option>
                  ))}
              </select>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-600 pointer-events-none" size={14} />
            </div>

            <button 
              onClick={() => setIsBookmarked(!isBookmarked)} 
              className={`p-3 rounded-2xl border-2 transition-all ${isBookmarked ? 'text-primary bg-primary/10 border-primary/40 shadow-[0_0_15px_rgba(var(--p),0.2)]' : 'border-white/5 hover:border-white/20 bg-white/5'}`}
            >
              <Bookmark size={20} strokeWidth={2.5} fill={isBookmarked ? "currentColor" : "none"} />
            </button>
            <button className="p-3 rounded-2xl border-2 border-white/5 hover:border-white/20 bg-white/5 text-slate-400 hover:text-white transition-all">
              <Share2 size={20} strokeWidth={2.5} />
            </button>
          </div>
      </div>

      {/* 2. Workspace Panes */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[38%_62%] gap-6 min-h-0 overflow-hidden">
        
        {/* LEFT PANEL: Module Logic & Telemetry */}
        <div className="flex flex-col bg-white/[0.01] border-2 border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
            <div className="flex bg-black/60 p-2 gap-2 border-b-2 border-white/5 shrink-0">
                {["description", "submissions", "discussion", "hints"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest transition-all ${
                            activeTab === tab ? "bg-white/5 text-primary border border-primary/20 shadow-inner" : "text-slate-600 hover:text-slate-300"
                        }`}
                    >
                        {tab === "description" && <FileText size={14}/>}
                        {tab === "submissions" && <Code2 size={14}/>}
                        {tab.replace('description', 'LOGIC')}
                    </button>
                ))}
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === "description" && (
                            <div className="space-y-12">
                                <p className="text-slate-300 leading-relaxed text-lg font-medium border-l-2 border-primary/20 pl-6 uppercase tracking-tight">
                                  {problem.description}
                                </p>

                                {Object.entries(problem.examples || {}).map(([key, ex], i) => (
                                    <div key={i} className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-px w-8 bg-primary/40" />
                                            <h4 className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-primary">
                                              EXAMPLE_NODE_{i + 1}
                                            </h4>
                                        </div>
                                        <div className="bg-[#080808] border-2 border-white/5 rounded-[1.5rem] p-8 font-mono text-sm space-y-4 shadow-inner">
                                            <div>
                                              <span className="text-slate-600 font-black mr-4 uppercase text-[9px] tracking-widest">INPUT_STREAM:</span> 
                                              <span className="text-blue-400 font-bold">{ex.input}</span>
                                            </div>
                                            <div>
                                              <span className="text-slate-600 font-black mr-4 uppercase text-[9px] tracking-widest">OUTPUT_TARGET:</span> 
                                              <span className="text-emerald-400 font-bold">{ex.output}</span>
                                            </div>
                                            {ex.explanation && (
                                              <div className="pt-4 border-t border-white/5">
                                                <span className="text-slate-600 font-black block mb-2 uppercase text-[9px] tracking-widest">LOGIC_EXPLANATION:</span> 
                                                <span className="text-slate-400 text-xs leading-relaxed uppercase">{ex.explanation}</span>
                                              </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {problem.constraints && (
                                    <div className="pt-10 border-t-2 border-white/5">
                                        <h4 className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-slate-600 mb-6">PHYSICAL_CONSTRAINTS</h4>
                                        <div className="bg-amber-500/5 border-2 border-amber-500/10 p-6 rounded-2xl font-mono text-sm text-amber-200/60 leading-none">
                                          {problem.constraints}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === "submissions" && <SubmissionsList submissions={submissions} isLoading={isSubmissionsLoading} />}
                        {activeTab === "discussion" && <div className="text-center py-32 text-slate-800 font-mono text-[10px] font-black uppercase tracking-[0.8em]">SIGNAL_VOID // NO_LOGS_FOUND</div>}
                        {activeTab === "hints" && (
                            <div className="bg-primary/5 border-2 border-primary/10 p-8 rounded-[1.5rem] font-mono text-primary/70 leading-relaxed text-sm uppercase">
                                <Terminal size={20} className="mb-4 opacity-50" />
                                {problem.hints || "ENCRYPTION_ACTIVE: NO_HINTS_AVAILABLE_FOR_MODULE"}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>

        {/* RIGHT PANEL: Logic_Editor & Execution_Telemetry */}
        <div className="flex flex-col gap-6 overflow-hidden min-h-0">
          
          {/* Main IDE Chassis */}
          <div className="flex-[1.6] bg-[#080808] border-2 border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.5)] relative">
             <div className="bg-black/60 px-8 py-4 border-b-2 border-white/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <Terminal size={16} strokeWidth={3} className="text-primary" />
                    <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-slate-500">Source_Buffer_V4.0</span>
                </div>
                <div className="flex gap-6">
                    <button 
                        onClick={handleRunCode} 
                        disabled={isExecuting} 
                        className="text-[11px] font-mono font-black uppercase tracking-widest hover:text-primary transition-all flex items-center gap-2 disabled:opacity-30"
                    >
                        {isExecuting ? <Loader2 size={14} className="animate-spin"/> : <Play size={14} strokeWidth={3}/>} 
                        Execute_Log
                    </button>
                    <button 
                        onClick={handleSubmitSolution} 
                        disabled={isExecuting} 
                        className="text-[11px] font-mono font-black uppercase tracking-widest text-primary hover:text-white transition-all flex items-center gap-2 disabled:opacity-30"
                    >
                        <Zap size={14} strokeWidth={3}/> 
                        Finalize_Module
                    </button>
                </div>
             </div>
             <div className="flex-1 min-h-0 bg-[#080808]">
                <Editor
                    height="100%"
                    language={selectedLanguage.toLowerCase()}
                    theme="vs-dark"
                    value={code}
                    onChange={(val) => setCode(val || "")}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 15,
                        fontFamily: "'JetBrains Mono', monospace",
                        lineNumbers: 'on',
                        padding: { top: 24 },
                        smoothScrolling: true,
                        cursorBlinking: "solid",
                        scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
                        automaticLayout: true,
                        renderLineHighlight: "all",
                        fontLigatures: true
                    }}
                />
             </div>
          </div>

          {/* Terminal Feedback Chassis */}
          <div className="flex-1 bg-black/40 border-2 border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl min-h-0">
             <div className="bg-black/60 px-8 py-3 border-b-2 border-white/5 text-[10px] font-mono font-black uppercase tracking-[0.6em] text-slate-600 shrink-0">
                Execution_Telemetry // Node_Active
             </div>
             <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {submission ? (
                  <Submission submission={submission} />
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-px w-6 bg-slate-800" />
                        <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-700">Pre_Defined_Validation_Nodes</h4>
                    </div>
                    <div className="grid gap-4">
                      {testCases.map((tc, i) => (
                        <div key={i} className="flex items-center justify-between p-6 bg-white/[0.02] border-2 border-white/5 rounded-2xl group hover:border-primary/20 transition-all shadow-inner">
                           <div className="flex gap-12">
                             <div><span className="text-[8px] font-mono font-black uppercase text-slate-700 block mb-2 tracking-widest">In_Stream</span> <code className="text-sm text-blue-400 font-mono font-bold">{tc.input}</code></div>
                             <div><span className="text-[8px] font-mono font-black uppercase text-slate-700 block mb-2 tracking-widest">Expected_Return</span> <code className="text-sm text-emerald-400 font-mono font-bold">{tc.output}</code></div>
                           </div>
                           <Circle size={12} strokeWidth={3} className="text-slate-800 group-hover:text-primary transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;