import React, { useState, useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bookmark, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Circle,
  ChevronLeft,
  ChevronRight,
  Database
} from "lucide-react";
import { useActions } from "../store/useAction";
import AddToPlaylistModal from "./AddToPlaylist";
import CreatePlaylistModal from "./CreatePlaylistModal";
import { usePlaylistStore } from "../store/usePlaylistStore";
import toast from "react-hot-toast";

const ProblemsTable = ({ problems }) => {
  const { authUser } = useAuthStore();
  const { onDeleteProblem } = useActions();
  const { createPlaylist } = usePlaylistStore();
  
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);

  const handleCreatePlaylist = async (data) => {
    try {
      await createPlaylist(data);
      toast.success("Collection_Initialized");
      setIsCreateModalOpen(false);
    } catch (error) {
      toast.error("Initialization_Failed");
    }
  };

  const handleAddToPlaylist = (problemId) => {
    setSelectedProblemId(problemId);
    setIsAddToPlaylistModalOpen(true);
  };

  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];
    const tagsSet = new Set();
    problems.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet).sort();
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return (problems || [])
      .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
      .filter((p) => (difficulty === "ALL" ? true : p.difficulty === difficulty))
      .filter((p) => (selectedTag === "ALL" ? true : p.tags?.includes(selectedTag)));
  }, [problems, search, difficulty, selectedTag]);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const paginatedProblems = useMemo(() => {
    return filteredProblems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredProblems, currentPage]);

  const difficultyStyles = {
    EASY: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    MEDIUM: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    HARD: "text-rose-400 bg-rose-400/10 border-rose-400/20",
  };

  return (
    <div className="space-y-10">
      {/* 1. Header Area: Straight & Heavy */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-black uppercase font-display tracking-tight text-white leading-none">
            Datasets
          </h2>
          <p className="text-slate-500 text-[10px] font-mono font-black tracking-[0.4em] uppercase">
            Sector: Module_Index // Select node to begin
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-3 bg-primary text-black px-8 py-4 rounded-2xl font-black uppercase tracking-tight transition-all hover:scale-[1.05] active:scale-95 shadow-[0_0_20px_rgba(var(--p),0.3)] font-display"
        >
          <Plus size={20} strokeWidth={3} />
          Create_Manifest
        </button>
      </div>

      {/* 2. Advanced Filtering Interface */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/[0.02] p-6 rounded-[2rem] border-2 border-white/5 shadow-2xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder="SEARCH_BY_ID..."
            className="w-full bg-black/40 border-2 border-white/5 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary/40 transition-all font-mono text-xs font-bold"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="relative group">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors" size={18} />
          <select
            className="w-full bg-black/40 border-2 border-white/5 rounded-2xl py-4 pl-12 pr-4 outline-none appearance-none cursor-pointer focus:border-primary/40 transition-all font-mono text-xs font-black uppercase tracking-widest text-slate-300"
            value={difficulty}
            onChange={(e) => { setDifficulty(e.target.value); setCurrentPage(1); }}
          >
            <option value="ALL">ALL_DIFFICULTIES</option>
            <option value="EASY">LEVEL: EASY</option>
            <option value="MEDIUM">LEVEL: MEDIUM</option>
            <option value="HARD">LEVEL: HARD</option>
          </select>
        </div>
        <div className="relative group">
          <Database className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors" size={18} />
          <select
            className="w-full bg-black/40 border-2 border-white/5 rounded-2xl py-4 pl-12 pr-4 outline-none appearance-none cursor-pointer focus:border-primary/40 transition-all font-mono text-xs font-black uppercase tracking-widest text-slate-300"
            value={selectedTag}
            onChange={(e) => { setSelectedTag(e.target.value); setCurrentPage(1); }}
          >
            <option value="ALL">ALL_TAG_NODES</option>
            {allTags.map((tag) => <option key={tag} value={tag}>{tag.toUpperCase()}</option>)}
          </select>
        </div>
      </div>

      {/* 3. The Industrial Module Feed */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {paginatedProblems.length > 0 ? (
            paginatedProblems.map((problem, index) => {
              const isSolved = problem.solvedby?.some((ps) => ps.userId === authUser?.id);
              return (
                <motion.div
                  key={problem.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex flex-col md:flex-row items-center justify-between p-6 bg-white/[0.02] hover:bg-white/[0.04] border-2 border-white/5 hover:border-primary/40 rounded-[2rem] transition-all duration-500 shadow-xl"
                >
                  <div className="flex items-center gap-8 w-full md:w-auto">
                    <div className={`${isSolved ? "text-primary drop-shadow-[0_0_8px_rgba(var(--p),0.4)]" : "text-slate-800"}`}>
                      {isSolved ? <CheckCircle2 size={28} strokeWidth={3} /> : <Circle size={28} strokeWidth={2} />}
                    </div>
                    <div className="space-y-1">
                      <Link 
                        to={`/problem/${problem.id}`} 
                        className="text-xl font-black font-display tracking-tight text-white group-hover:text-primary transition-colors leading-none uppercase"
                      >
                        {problem.title}
                      </Link>
                      <div className="flex gap-4 pt-1">
                        {problem.tags?.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="text-[9px] font-mono font-black uppercase tracking-[0.2em] text-slate-600 flex items-center gap-1.5">
                            <div className="size-1 bg-slate-800 rounded-full" /> {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto mt-6 md:mt-0">
                    <span className={`px-5 py-1.5 rounded-xl text-[10px] font-mono font-black tracking-[0.2em] border-2 uppercase ${difficultyStyles[problem.difficulty]}`}>
                      {problem.difficulty}
                    </span>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleAddToPlaylist(problem.id)}
                        className="p-4 bg-white/5 hover:bg-primary/10 text-slate-500 hover:text-primary rounded-2xl border-2 border-transparent transition-all shadow-lg"
                        title="Link_to_Manifest"
                      >
                        <Bookmark size={20} strokeWidth={2.5} />
                      </button>
                      {authUser?.role === "ADMIN" && (
                        <button
                          onClick={() => onDeleteProblem(problem.id)}
                          className="p-4 bg-white/5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 rounded-2xl border-2 border-transparent transition-all shadow-lg"
                          title="Purge_Module"
                        >
                          <Trash2 size={20} strokeWidth={2.5} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-32 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
              <Database size={48} className="mx-auto text-slate-800 mb-6" />
              <p className="text-sm font-mono font-black uppercase tracking-[0.5em] text-slate-700">No_Active_Modules_Detected</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Heavy Pagination Interface */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-8 pt-10 border-t border-white/5">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="p-4 bg-white/5 border-2 border-white/5 rounded-2xl disabled:opacity-10 hover:bg-white/10 hover:border-primary/40 transition-all text-primary"
          >
            <ChevronLeft strokeWidth={3} />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono font-black tracking-[0.5em] uppercase text-slate-600">Active_Node</span>
            <span className="text-xl font-display font-black text-white">0{currentPage} / 0{totalPages}</span>
          </div>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="p-4 bg-white/5 border-2 border-white/5 rounded-2xl disabled:opacity-10 hover:bg-white/10 hover:border-primary/40 transition-all text-primary"
          >
            <ChevronRight strokeWidth={3} />
          </button>
        </div>
      )}

      <CreatePlaylistModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreatePlaylist} />
      <AddToPlaylistModal isOpen={isAddToPlaylistModalOpen} onClose={() => setIsAddToPlaylistModalOpen(false)} problemId={selectedProblemId} />
    </div>
  );
};

export default ProblemsTable;