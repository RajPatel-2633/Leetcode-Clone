import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Search, FileCode, Database, Terminal } from "lucide-react";
import ProblemCard from "./ProblemCard";

const categories = [
  { id: "all", name: "ALL_MODULES", Icon: FileCode },
  { id: "array", name: "ARRAYS_STRINGS", Icon: Database },
  { id: "linkedlist", name: "LINKED_LISTS", Icon: Terminal },
  { id: "tree", name: "TREES_GRAPHS", Icon: Terminal },
  { id: "dp", name: "DYNAMIC_PROGRAMMING", Icon: Database },
  { id: "other", name: "MISC_ALGOS", Icon: FileCode },
];

const SampleProblemSelector = ({ isOpen, onClose, onSelectProblem, problems }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProblems, setFilteredProblems] = useState(problems);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  useEffect(() => {
    let filtered = problems;
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((p) => 
        p.title.toLowerCase().includes(lowerQuery) || 
        p.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    }
    setFilteredProblems(filtered);
  }, [selectedCategory, searchQuery, problems]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* 1. Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />

          {/* 2. Modal Body */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-[#080808] border-2 border-white/5 w-full max-w-6xl h-[85vh] rounded-[2rem] overflow-hidden shadow-[0_0_60px_rgba(0,0,0,1)] z-10 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Hub */}
            <div className="p-8 border-b-2 border-white/5 flex justify-between items-center bg-black/40 backdrop-blur-md z-50">
              <div className="space-y-1">
                <h2 className="text-4xl font-black uppercase font-display tracking-tight text-white leading-none">
                  Dataset_Index<span className="text-primary">.</span>
                </h2>
                <p className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.4em]">
                  Directory // Sector: Sample_Protocols
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-4 bg-white/5 border-2 border-white/5 rounded-2xl hover:bg-rose-500/10 hover:border-rose-500/40 text-slate-500 hover:text-rose-500 transition-all"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden">
              {/* 3. Data-Node Sidebar */}
              <div className="w-80 bg-black/40 p-8 border-r-2 border-white/5 overflow-y-auto custom-scrollbar space-y-8">
                <div className="flex items-center gap-3">
                    <div className="h-px w-8 bg-primary/40" />
                    <h4 className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-slate-600">Category_Nodes</h4>
                </div>
                
                <div className="space-y-4">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={`w-full group px-6 py-4 rounded-2xl flex items-center justify-between border-2 transition-all duration-300 ${
                        selectedCategory === category.id
                          ? "bg-primary text-black border-primary shadow-[0_0_20px_rgba(var(--p),0.3)]"
                          : "bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.05]"
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <span className={`text-[11px] font-mono font-black tracking-widest flex items-center gap-4 ${selectedCategory === category.id ? "text-black" : "text-slate-400 group-hover:text-white"}`}>
                        <category.Icon size={16} strokeWidth={selectedCategory === category.id ? 3 : 2} /> 
                        {category.name}
                      </span>
                      <ChevronRight size={16} strokeWidth={3} className={`transition-transform ${selectedCategory === category.id ? "text-black rotate-90" : "text-slate-800"}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Explorer Panel */}
              <div className="flex-1 flex flex-col h-full bg-black/20">
                {/* Search Bar */}
                <div className="p-8 border-b-2 border-white/5 bg-black/40 backdrop-blur-md z-10">
                  <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors" size={20} />
                    <input
                      type="text"
                      placeholder="SEARCH_ACTIVE_PROTOCOLS..."
                      className="w-full bg-black/40 border-2 border-white/5 rounded-2xl py-5 pl-14 pr-6 outline-none focus:border-primary/40 transition-all font-mono text-xs font-bold text-white tracking-widest"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Problem Feed */}
                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                  <AnimatePresence mode="wait">
                    {filteredProblems.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="flex flex-col items-center justify-center h-full text-center border-2 border-dashed border-white/5 rounded-[3rem] py-20 bg-white/[0.01]"
                      >
                         <Terminal size={48} className="text-slate-800 mb-6" />
                         <p className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-slate-700">Sector_Empty: No_Matching_Nodes</p>
                      </motion.div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {filteredProblems.map((problem, index) => (
                          <motion.div
                            key={problem.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <ProblemCard 
                              problem={problem}
                              onSelect={() => onSelectProblem(problem.id)}
                            />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SampleProblemSelector;