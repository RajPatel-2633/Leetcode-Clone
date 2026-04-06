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
    if (!code.trim()) return toast.error("Write some code first.");
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
          <Terminal size={64} className="text-primary animate-bounce" />
        </div>
        <p className="mt-8 font-black uppercase tracking-[0.4em] text-xs text-primary/60">Booting Environment...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6 overflow-hidden">
      
      {/* 1. Header Hub */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] backdrop-blur-md shrink-0">
          <div className="flex items-center gap-6">
            <Link to="/" className="p-2 hover:bg-white/5 rounded-lg transition-colors group">
              <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black italic uppercase tracking-tighter">{problem.title}</h1>
                <span className={`text-[10px] px-2 py-0.5 font-bold rounded border ${
                    problem.difficulty === "EASY" ? "text-emerald-400 border-emerald-400/20" : 
                    problem.difficulty === "MEDIUM" ? "text-amber-400 border-amber-400/20" : "text-rose-400 border-rose-400/20"
                }`}>{problem.difficulty}</span>
              </div>
              <div className="flex items-center gap-4 text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">
                <span className="flex items-center gap-1"><Users size={12}/> {submissionCount} Attempts</span>
                <span className="flex items-center gap-1"><ThumbsUp size={12}/> 95% Success Rate</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select 
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase outline-none focus:border-primary/50 transition-all"
                value={selectedLanguage}
                onChange={handleLanguageChange}
            >
                {Object.keys(problem.codeSnippets || {}).map((lang) => (
                    <option key={lang} value={lang} className="bg-[#121212]">{lang}</option>
                ))}
            </select>
            <button 
              onClick={() => setIsBookmarked(!isBookmarked)} 
              className={`p-2 rounded-xl border border-white/10 transition-all ${isBookmarked ? 'text-primary bg-primary/10 border-primary/30' : 'hover:bg-white/5'}`}
            >
              <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
            </button>
            <button className="p-2 rounded-xl border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
              <Share2 size={18}/>
            </button>
          </div>
      </div>

      {/* 2. Main Workspace Panes */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[40%_60%] gap-6 min-h-0 overflow-hidden">
        
        {/* LEFT PANEL: Description & Tabs */}
        <div className="flex flex-col bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="flex bg-black/20 p-1.5 gap-1 border-b border-white/5 shrink-0">
                {["description", "submissions", "discussion", "hints"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            activeTab === tab ? "bg-white/10 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                        }`}
                    >
                        {tab === "description" && <FileText size={14}/>}
                        {tab === "submissions" && <Code2 size={14}/>}
                        {tab}
                    </button>
                ))}
            </div>
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === "description" && (
                            <div className="space-y-8">
                                <p className="text-slate-300 leading-relaxed text-lg">{problem.description}</p>
                                {Object.entries(problem.examples || {}).map(([key, ex], i) => (
                                    <div key={i} className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                                            <Zap size={14} /> Example_{i + 1}
                                        </h4>
                                        <div className="bg-black/40 border border-white/5 rounded-2xl p-6 font-mono text-sm space-y-3">
                                            <div><span className="text-slate-500 font-bold mr-2 uppercase text-[10px]">Input:</span> <span className="text-blue-400">{ex.input}</span></div>
                                            <div><span className="text-slate-500 font-bold mr-2 uppercase text-[10px]">Output:</span> <span className="text-emerald-400">{ex.output}</span></div>
                                            {ex.explanation && <div><span className="text-slate-500 font-bold mr-2 uppercase block mb-1 text-[10px]">Explanation:</span> <span className="text-slate-400 italic text-xs">{ex.explanation}</span></div>}
                                        </div>
                                    </div>
                                ))}
                                {problem.constraints && (
                                    <div className="pt-6 border-t border-white/5">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Constraints</h4>
                                        <code className="block bg-white/5 p-4 rounded-xl text-amber-200/70 text-sm italic border border-white/5">
                                            {problem.constraints}
                                        </code>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === "submissions" && <SubmissionsList submissions={submissions} isLoading={isSubmissionsLoading} />}
                        {activeTab === "discussion" && <div className="text-center py-20 text-slate-500 italic uppercase text-[10px] font-black tracking-widest">Feed_Silent. No logs found.</div>}
                        {activeTab === "hints" && (
                            <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl italic text-primary/80 leading-relaxed text-sm">
                                {problem.hints || "No hints encrypted for this module."}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>

        {/* RIGHT PANEL: Editor & Terminal */}
        <div className="flex flex-col gap-6 overflow-hidden min-h-0">
          {/* Editor */}
          <div className="flex-[1.5] bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl relative">
             <div className="bg-black/40 px-6 py-3 border-b border-white/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Source_Buffer</span>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={handleRunCode} 
                        disabled={isExecuting} 
                        className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2 disabled:opacity-30"
                    >
                        {isExecuting ? <Loader2 size={12} className="animate-spin"/> : <Play size={12}/>} Run_Code
                    </button>
                    <button 
                        onClick={handleSubmitSolution} 
                        disabled={isExecuting} 
                        className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors flex items-center gap-2 disabled:opacity-30"
                    >
                        <Zap size={12}/> Submit_Module
                    </button>
                </div>
             </div>
             <div className="flex-1 min-h-0">
                <Editor
                    height="100%"
                    language={selectedLanguage.toLowerCase()}
                    theme="vs-dark"
                    value={code}
                    onChange={(val) => setCode(val || "")}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 15,
                        fontFamily: "JetBrains Mono, monospace",
                        lineNumbers: 'on',
                        padding: { top: 20 },
                        smoothScrolling: true,
                        cursorBlinking: "expand",
                        scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
                        automaticLayout: true
                    }}
                />
             </div>
          </div>

          {/* Terminal / Result */}
          <div className="flex-1 bg-black/40 border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl min-h-0">
             <div className="bg-black/20 px-6 py-3 border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500 shrink-0">
                Execution_Telemetry
             </div>
             <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {submission ? (
                  <Submission submission={submission} />
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-600">Pre_Defined_Test_Nodes</h4>
                    </div>
                    <div className="grid gap-3">
                      {testCases.map((tc, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl group hover:border-primary/20 transition-all">
                           <div className="flex gap-8">
                             <div><span className="text-[8px] font-black uppercase opacity-30 block mb-1">In_Stream</span> <code className="text-xs text-blue-300 font-mono">{tc.input}</code></div>
                             <div><span className="text-[8px] font-black uppercase opacity-30 block mb-1">Out_Target</span> <code className="text-xs text-emerald-300 font-mono">{tc.output}</code></div>
                           </div>
                           <Circle size={10} className="text-slate-800" />
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