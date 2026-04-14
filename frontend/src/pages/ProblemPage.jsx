import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  FileText,
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
  const normalizeSnippetData = (raw) => {
    if (!raw) return {};

    const parsePossiblyStringified = (value) => {
      let parsed = value;
      if (typeof parsed === "string") {
        try {
          parsed = JSON.parse(parsed);
        } catch {
          return {};
        }
      }
      if (typeof parsed === "string") {
        try {
          parsed = JSON.parse(parsed);
        } catch {
          return {};
        }
      }
      return parsed;
    };

    const parsedRaw = parsePossiblyStringified(raw);
    const candidates = [
      parsedRaw,
      parsedRaw?.codeSnippets,
      parsedRaw?.codeSnippet,
      parsedRaw?.snippets,
      parsedRaw?.data,
    ];

    let normalized = {};
    for (const candidate of candidates) {
      const parsedCandidate = parsePossiblyStringified(candidate);
      if (parsedCandidate && typeof parsedCandidate === "object" && !Array.isArray(parsedCandidate)) {
        const objectToUse =
          parsedCandidate?.codeSnippets ||
          parsedCandidate?.codeSnippet ||
          parsedCandidate?.snippets ||
          parsedCandidate?.data ||
          parsedCandidate;

        if (objectToUse && typeof objectToUse === "object" && !Array.isArray(objectToUse)) {
          normalized = objectToUse;
          if (Object.keys(normalized).length > 0) break;
        }
      }
    }

    return normalized;
  };

  const { id } = useParams();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();
  const { submission: submissions, isLoading: isSubmissionsLoading, getSubmissionForProblem, getSubmissionCountForProblem, submissionCount } = useSubmissionStore();
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("JAVASCRIPT");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isUserModified, setIsUserModified] = useState(false);
  const [testCases, setTestCases] = useState([]);
  const snippets = normalizeSnippetData(problem);
  const languageOptions = Object.keys(snippets);
  const availableLanguages = languageOptions.length > 0 ? languageOptions : ["JAVASCRIPT"];
  const hasLanguages = languageOptions.length > 0;

  const { executeCode, submission, isExecuting } = useExecutionStore();

  useEffect(() => {
    getProblemById(id);
    getSubmissionCountForProblem(id);
  }, [id, getProblemById, getSubmissionCountForProblem]);

  useEffect(() => {
    if (problem) {
      const normalizedKeys = Object.keys(snippets || {});
      if (normalizedKeys.length > 0) {
        const initialLang = normalizedKeys[0];
        const initialCode =
          snippets?.[initialLang] ||
          snippets?.[initialLang?.toLowerCase?.()] ||
          "";
        setSelectedLanguage(initialLang);
        setCode(initialCode || submission?.sourceCode || "");
      }
      setIsUserModified(false);
      setTestCases(
        problem.testCases?.map((tc) => ({
          input: tc.input || tc?.data?.input || "",
          output: tc.output || tc?.data?.output || "",
          explanation: tc.explanation || tc?.data?.explanation || "",
        })) || []
      );
    }
  }, [problem, id, snippets, submission?.sourceCode]);

  useEffect(() => {
    if (!problem) return;
    if (isUserModified) return;
    const selectedCode =
      snippets?.[selectedLanguage] ||
      snippets?.[selectedLanguage?.toUpperCase?.()] ||
      snippets?.[selectedLanguage?.toLowerCase?.()] ||
      "";
    if (selectedCode) {
      setCode(selectedCode);
    } else if (submission?.sourceCode) {
      setCode(submission.sourceCode);
    }
  }, [problem, selectedLanguage, snippets, submission?.sourceCode, isUserModified]);

  useEffect(() => {
    if (activeTab === "submissions" && id) {
      getSubmissionForProblem(id);
    }
  }, [activeTab, id, getSubmissionForProblem]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setIsUserModified(false);
    setCode(
      snippets?.[lang] ||
        snippets?.[lang?.toUpperCase?.()] ||
        snippets?.[lang?.toLowerCase?.()] ||
        ""
    );
  };

  const handleRunCode = async () => {
    if (!code.trim()) return toast.error("ACCESS_DENIED: SOURCE_BUFFER_EMPTY");
    const languageId = getLanguageId(selectedLanguage.toLowerCase());
    const stdin = testCases.map((tc) => tc.input);
    const expected_outputs = testCases.map((tc) => tc.output);
    await executeCode(code, languageId, stdin, expected_outputs, problem.id);
  };

  const examplesData = problem?.examples;
  let activeExamples = [];
  if (Array.isArray(examplesData)) {
    activeExamples = examplesData;
  } else if (examplesData && typeof examplesData === "object") {
    const langExamples =
      examplesData[selectedLanguage] ||
      examplesData[selectedLanguage?.toUpperCase?.()] ||
      examplesData[selectedLanguage?.toLowerCase?.()];
    if (Array.isArray(langExamples)) {
      activeExamples = langExamples;
    } else if (langExamples && typeof langExamples === "object") {
      activeExamples = [langExamples];
    }
  }
  if (activeExamples.length === 0) {
    activeExamples = problem?.testCases?.slice(0, 3) || [];
  }
  if (activeExamples.length > 0 && activeExamples.length < 3) {
    const fallbackCases = (problem?.testCases || []).slice(0, 3);
    activeExamples = [...activeExamples, ...fallbackCases].slice(0, 3);
  }

  const handleSubmitSolution = async () => {
    await handleRunCode();
    setActiveTab("submissions");
    if (id) await getSubmissionForProblem(id);
  };

  if (isProblemLoading || !problem) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#050505]">
        <div className="w-full max-w-5xl space-y-4 px-6">
          <div className="h-16 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="h-[420px] rounded-2xl bg-white/[0.03] border border-white/10 animate-pulse" />
            <div className="lg:col-span-2 h-[420px] rounded-2xl bg-white/[0.03] border border-white/10 animate-pulse" />
          </div>
        </div>
        <p className="mt-8 font-mono font-black uppercase tracking-[0.5em] text-[10px] text-primary/60 animate-pulse">
          SYSTEM_LOADING // SYNCING_DATA_SECTOR
        </p>
      </div>
    );
  }

  return (
    // FIXED: Changed from fixed calc height to h-full flex flex-col to match Layout.jsx
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      
      {/* 1. Header Hub: High-Density Control Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl shrink-0">
          <div className="flex items-center gap-6 min-w-0 flex-1">
            <Link to="/" className="p-2 bg-white/5 border border-white/5 hover:border-primary/40 rounded-xl transition-all group shrink-0">
              <ArrowLeft size={18} strokeWidth={3} />
            </Link>
            <div className="space-y-0.5 min-w-0 flex-1">
              <div className="flex items-center gap-3 min-w-0">
                {/* TYPOGRAPHY: Reduced title size for professional density */}
                <h1 className="text-xl font-black uppercase tracking-tight text-white truncate min-w-0">
                  {problem.title}
                </h1>
                <span className={`shrink-0 text-[11px] px-2 py-0.5 font-mono font-black rounded border uppercase tracking-widest ${
                    problem.difficulty === "EASY" ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/5" : 
                    problem.difficulty === "MEDIUM" ? "text-amber-400 border-amber-400/20 bg-amber-400/5" : "text-rose-500 border-rose-500/20 bg-rose-500/5"
                }`}>{problem.difficulty}</span>
              </div>
              <div className="flex items-center gap-4 text-[11px] font-mono font-black text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><Users size={10}/> {submissionCount} ATTEMPTS</span>
                <span className="flex items-center gap-1.5"><ThumbsUp size={10}/> 95% SUCCESS</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="relative group">
              {hasLanguages ? (
                <select 
                  className="bg-black border border-white/10 rounded-xl px-4 py-2 text-[11px] font-mono font-black uppercase tracking-widest outline-none focus:border-primary/50 appearance-none cursor-pointer pr-8"
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                >
                    {availableLanguages.map((lang) => (
                        <option key={lang} value={lang} className="bg-[#080808]">{lang.toUpperCase()}</option>
                    ))}
                </select>
              ) : (
                <div className="bg-black border border-white/10 rounded-xl px-4 py-2 text-[11px] font-mono font-black uppercase tracking-widest text-amber-400">
                  No Languages Available
                </div>
              )}
              {hasLanguages && <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" size={12} />}
            </div>

            <button 
              onClick={() => setIsBookmarked(!isBookmarked)} 
              className={`p-2 rounded-xl border transition-all shrink-0 ${isBookmarked ? 'text-primary bg-primary/10 border-primary/40' : 'border-white/5 hover:border-white/20 bg-white/5'}`}
            >
              <Bookmark size={18} strokeWidth={2.5} fill={isBookmarked ? "currentColor" : "none"} />
            </button>
            <button
              type="button"
              onClick={async () => {
                const url = window.location.href;
                try {
                  await navigator.clipboard.writeText(url);
                  toast.success("LINK_COPIED_TO_BUFFER");
                } catch {
                  toast.error("COPY_FAILED");
                }
              }}
              className="p-2 rounded-xl border border-white/5 hover:border-white/20 bg-white/5 text-slate-400 hover:text-white transition-all shrink-0"
              title="Copy problem link"
            >
              <Share2 size={18} strokeWidth={2.5} />
            </button>
          </div>
      </div>

      {/* 2. Workspace Panes */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0 overflow-hidden">
        
        {/* LEFT PANEL: Module Logic & Telemetry */}
        <div className="w-full lg:w-[38%] flex flex-col bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden min-h-0">
            <div className="flex bg-black/40 p-1.5 gap-1.5 border-b border-white/5 shrink-0">
                {["description", "submissions", "discussion", "hints"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[11px] font-mono font-black uppercase tracking-widest transition-all ${
                            activeTab === tab ? "bg-white/5 text-primary border border-primary/20" : "text-slate-400 hover:text-slate-300"
                        }`}
                    >
                        {tab === "description" && <FileText size={12}/>}
                        {tab === "submissions" && <Code2 size={12}/>}
                        {tab.replace('description', 'LOGIC')}
                    </button>
                ))}
            </div>
            
            {/* FIXED: Independent Scroll for Description */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.15 }}
                    >
                        {activeTab === "description" && (
                            <div className="space-y-8">
                                <p className="text-slate-300 leading-relaxed text-sm font-medium border-l-2 border-primary/40 pl-4 uppercase tracking-tight">
                                  {problem.description}
                                </p>

                                {activeExamples.map((node, i) => (
                                    <div key={`example-node-${i}`} className="space-y-3">
                                        <h4 className="text-[11px] font-mono font-black uppercase tracking-[0.3em] text-primary/60 flex items-center gap-2">
                                          <Circle size={8} fill="currentColor"/> NODE_EXAMPLE_{i + 1}
                                        </h4>
                                        <div className="bg-black/40 border border-white/5 rounded-xl p-5 font-mono text-xs space-y-3">
                                            <div>
                                              <span className="text-slate-400 font-black mr-3 uppercase text-[11px] tracking-widest">INPUT_STREAM:</span> 
                                              <span className="text-blue-400 font-bold">{node.input || node?.data?.input || ""}</span>
                                            </div>
                                            <div>
                                              <span className="text-slate-400 font-black mr-3 uppercase text-[11px] tracking-widest">OUTPUT_TARGET:</span> 
                                              <span className="text-emerald-400 font-bold">{node.output || node?.data?.output || ""}</span>
                                            </div>
                                            {(node.explanation || node?.data?.explanation) && (
                                              <div className="pt-3 border-t border-white/5">
                                                <span className="text-slate-400 font-black block mb-1 uppercase text-[11px] tracking-widest">LOGIC_EXP:</span> 
                                                <span className="text-slate-400 text-[10px] leading-relaxed uppercase">{node.explanation || node?.data?.explanation || ""}</span>
                                              </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {problem.constraints && (
                                    <div className="pt-6 border-t border-white/5">
                                        <h4 className="text-[11px] font-mono font-black uppercase tracking-widest text-slate-400 mb-3">PHYSICAL_CONSTRAINTS</h4>
                                        <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-xl font-mono text-xs text-amber-200/60 leading-relaxed">
                                          <pre className="whitespace-pre-wrap">{problem.constraints}</pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === "submissions" && <SubmissionsList submissions={submissions} isLoading={isSubmissionsLoading} />}
                        {activeTab === "discussion" && <div className="text-center py-20 text-slate-400 font-mono text-[11px] font-black uppercase tracking-widest">SIGNAL_VOID // NO_LOGS</div>}
                        {activeTab === "hints" && (
                            <div className="bg-primary/5 border border-primary/10 p-6 rounded-xl font-mono text-primary/70 text-xs uppercase">
                                {problem.hints || "ENCRYPTION_ACTIVE: NO_HINTS_AVAILABLE"}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>

        {/* RIGHT PANEL: Logic_Editor & Execution_Telemetry */}
        <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-hidden">
          
          {/* Main IDE Chassis */}
          <div className="flex-[1.5] bg-[#080808] border border-white/5 rounded-2xl overflow-hidden flex flex-col relative min-h-0">
              <div className="bg-black/60 px-6 py-3 border-b border-white/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <Terminal size={14} strokeWidth={3} className="text-primary" />
                    <span className="text-[11px] font-mono font-black uppercase tracking-widest text-slate-400">Source_Buffer_V4.0</span>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={handleRunCode} 
                        disabled={isExecuting} 
                        className="text-[10px] font-mono font-black uppercase tracking-widest hover:text-primary transition-all flex items-center gap-2 disabled:opacity-30"
                    >
                        {isExecuting ? <Loader2 size={12} className="animate-spin"/> : <Play size={12} strokeWidth={3}/>} 
                        RUN_CODE
                    </button>
                    <button 
                        onClick={handleSubmitSolution} 
                        disabled={isExecuting} 
                        className="text-[10px] font-mono font-black uppercase tracking-widest text-primary hover:text-white transition-all flex items-center gap-2 disabled:opacity-30"
                    >
                        <Zap size={12} strokeWidth={3}/> 
                        SUBMIT_SOLUTION
                    </button>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <Editor
                    key={`${problem?.id || "problem"}-${selectedLanguage}`}
                    height="100%"
                    language={selectedLanguage.toLowerCase()}
                    theme="vs-dark"
                    value={
                      snippets?.[selectedLanguage] ||
                      snippets?.[selectedLanguage?.toUpperCase?.()] ||
                      snippets?.[selectedLanguage?.toLowerCase?.()] ||
                      code ||
                      ""
                    }
                    onChange={(val) => {
                      setCode(val || "");
                      setIsUserModified(true);
                    }}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        fontFamily: "'JetBrains Mono', monospace",
                        lineNumbers: 'on',
                        padding: { top: 16 },
                        automaticLayout: true,
                        scrollbar: { verticalScrollbarSize: 4 },
                    }}
                />
              </div>
          </div>

          {/* Terminal Feedback Chassis */}
          <div className="flex-1 bg-black/40 border border-white/5 rounded-2xl overflow-hidden flex flex-col min-h-0 shadow-xl">
             <div className="bg-black/60 px-6 py-2 border-b border-white/5 text-[11px] font-mono font-black uppercase tracking-widest text-slate-400 shrink-0">
                Execution_Telemetry
             </div>
             <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {submission ? (
                  <Submission submission={submission} />
                ) : (
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-mono font-black uppercase tracking-widest text-slate-400">PRE_VALIDATION_NODES</h4>
                    <div className="grid gap-3">
                      {testCases.map((tc, i) => (
                        <div key={i} className="flex flex-col p-4 bg-white/[0.02] border border-white/5 rounded-xl group hover:border-primary/20 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="flex gap-8">
                                  <div>
                                    <span className="text-[11px] font-mono font-black uppercase text-slate-400 block mb-1 tracking-widest">IN</span> 
                                    <code className="text-xs text-blue-400 font-mono font-bold">{tc.input}</code>
                                  </div>
                                  <div>
                                    <span className="text-[11px] font-mono font-black uppercase text-slate-400 block mb-1 tracking-widest">OUT</span> 
                                    <code className="text-xs text-emerald-400 font-mono font-bold">{tc.output}</code>
                                  </div>
                                </div>
                                <Circle size={10} strokeWidth={3} className="text-slate-800 group-hover:text-primary transition-colors" />
                            </div>
                            {activeTab !== "description" && tc.explanation && (
                              <div className="mt-3 pt-3 border-t border-white/5">
                                <span className="text-[11px] font-mono font-black uppercase text-slate-400 block mb-1 tracking-widest">LOGIC_EXP</span>
                                <p className="text-[10px] text-slate-400 leading-relaxed uppercase italic">
                                  {tc.explanation}
                                </p>
                              </div>
                            )}
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