import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Search, FileCode, database, Terminal } from "lucide-react";
import ProblemCard from "./ProblemCard";

// Themed Icons for categories
const categories = [
  { id: "all", name: "All Modules", Icon: FileCode },
  { id: "array", name: "Arrays & Strings", Icon: database },
  { id: "linkedlist", name: "Linked Lists", Icon: Terminal },
  { id: "tree", name: "Trees & Graphs", Icon: Terminal },
  { id: "dp", name: "Dynamic_Programming", Icon: database },
  { id: "other", name: "Misc_Algos", Icon: FileCode },
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
      filtered = filtered.filter((p) => p.title.toLowerCase().includes(lowerQuery) || p.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)));
    }
    setFilteredProblems(filtered);
  }, [selectedCategory, searchQuery, problems]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* 1. Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* 2. Modal Body */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative bg-[#121212] border border-white/10 w-full max-w-6xl h-[85vh] rounded-[2.5rem] overflow-hidden shadow-2xl z-10 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Background Decorative Blob */}
            <div className="fixed top-1/2 -left-1/3 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-[-1]"/>

            {/* Header Hub */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/30 backdrop-blur-sm sticky top-0">
              <div>
                <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">
                  Dataset_Index.
                </h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Directory / Sample_Solutions</p>
              </div>
              <button
                onClick={onClose}
                className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-slate-500 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Container */}
            <div className="flex flex-1 overflow-hidden h-[calc(85vh-96px)]">
              {/* 3. Data-Node Sidebar */}
              <div className="w-80 bg-black/30 backdrop-blur-md p-6 border-r border-white/5 overflow-y-auto custom-scrollbar">
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-6 ml-2">Category_Nodes</h4>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={`w-full group px-5 py-4 rounded-xl flex items-center justify-between border-2 transition-all duration-300 ${
                        selectedCategory === category.id
                          ? "bg-primary text-black border-primary shadow-[0_0_15px_rgba(var(--p),0.2)]"
                          : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <span className={`text-sm font-bold tracking-tight flex items-center gap-3 ${selectedCategory === category.id ? "text-black" : "text-white"}`}>
                        <category.Icon size={16} /> {category.name}
                      </span>
                      <ChevronRight className={`w-4 h-4 transition-transform ${selectedCategory === category.id ? "text-black rotate-90" : "text-slate-600 group-hover:text-white"}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Explorer Panel */}
              <div className="flex-1 flex flex-col h-full">
                {/* Search Bar */}
                <div className="p-6 border-b border-white/5 sticky top-0 bg-[#121212]/80 backdrop-blur-sm z-10">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="text"
                      placeholder="Search protocols or keywords..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-primary/50 transition-all font-bold"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Problem Feed */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <AnimatePresence mode="wait">
                    {filteredProblems.length === 0 ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full text-center border-2 border-dashed border-white/5 rounded-3xl py-12">
                         <Terminal size={40} className="text-slate-700 mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">No modules found in this sector matching criteria.</p>
                      </motion.div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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