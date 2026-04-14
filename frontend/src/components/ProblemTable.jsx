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
    <div className="space-y-8">
      {/* 1. Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-black uppercase font-display tracking-tight text-white leading-none">
            Datasets_Index
          </h2>
          <p className="text-slate-400 text-[11px] font-mono font-black tracking-[0.4em] uppercase">
            Sector: Module_Archive // Select node
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex-shrink-0 flex items-center justify-center gap-4 bg-primary text-black px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.05] hover:shadow-[0_0_30px_rgba(var(--p),0.4)] active:scale-95 font-display text-sm border-2 border-black/10"
        >
          <Plus size={22} strokeWidth={4} />
          <span className="text-base tracking-[0.1em] leading-none">
            CREATE_MANIFEST
          </span>
        </button>
      </div>

      {/* 2. Advanced Filtering Interface */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/[0.02] p-4 rounded-3xl border border-white/10">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
          <input
            type="text"
            placeholder="SEARCH_BY_ID..."
            className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary/40 transition-all font-mono text-[11px] font-bold text-white"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="relative group">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
          <select
            className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 outline-none appearance-none cursor-pointer focus:border-primary/40 transition-all font-mono text-[11px] font-black uppercase tracking-widest text-slate-300"
            value={difficulty}
            onChange={(e) => { setDifficulty(e.target.value); setCurrentPage(1); }}
          >
            <option value="ALL">ALL_DIFFICULTIES</option>
            <option value="EASY">EASY</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HARD">HARD</option>
          </select>
        </div>
        <div className="relative group">
          <Database className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
          <select
            className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 outline-none appearance-none cursor-pointer focus:border-primary/40 transition-all font-mono text-[11px] font-black uppercase tracking-widest text-slate-300"
            value={selectedTag}
            onChange={(e) => { setSelectedTag(e.target.value); setCurrentPage(1); }}
          >
            <option value="ALL">ALL_TAG_NODES</option>
            {allTags.map((tag) => <option key={tag} value={tag}>{tag.toUpperCase()}</option>)}
          </select>
        </div>
      </div>

      {/* 3. The Industrial Module Feed */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {paginatedProblems.length > 0 ? (
            paginatedProblems.map((problem, index) => {
              const isSolved = problem.solvedby?.some((ps) => ps.userId === authUser?.id);
              return (
                <motion.div
                  key={problem.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ delay: index * 0.03 }}
                  className="group flex flex-col md:flex-row items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-primary/30 rounded-2xl transition-all duration-300"
                >
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    {/* FIXED: Status icon won't shrink */}
                    <div className={`flex-shrink-0 ${isSolved ? "text-primary drop-shadow-[0_0_8px_rgba(var(--p),0.3)]" : "text-slate-800"}`}>
                      {isSolved ? <CheckCircle2 size={24} strokeWidth={3} /> : <Circle size={24} strokeWidth={2} />}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <Link 
                        to={`/problem/${problem.id}`} 
                        className="text-lg font-black font-display tracking-tight text-white group-hover:text-primary transition-colors leading-none uppercase truncate block"
                      >
                        {problem.title}
                      </Link>
                      <div className="flex flex-wrap gap-3 pt-1">
                        {problem.tags?.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="text-[11px] font-mono font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                            <div className="size-1 bg-primary/40 rounded-full" /> {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-4 md:mt-0">
                    <span className={`flex-shrink-0 px-4 py-1 rounded-lg text-[11px] font-mono font-black tracking-widest border uppercase ${difficultyStyles[problem.difficulty]}`}>
                      {problem.difficulty}
                    </span>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleAddToPlaylist(problem.id)}
                        className="flex-shrink-0 p-3 bg-white/5 hover:bg-primary/10 text-slate-400 hover:text-primary rounded-xl border border-transparent transition-all"
                        title="Link_to_Manifest"
                      >
                        <Bookmark size={18} strokeWidth={2.5} />
                      </button>
                      {authUser?.role === "ADMIN" && (
                        <button
                          onClick={() => onDeleteProblem(problem.id)}
                          className="flex-shrink-0 p-3 bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-xl border border-transparent transition-all"
                          title="Purge_Module"
                        >
                          <Trash2 size={18} strokeWidth={2.5} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
              <Database size={40} className="mx-auto text-slate-800 mb-4" />
              <p className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-slate-400">No_Active_Modules_Detected</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Pagination Interface */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 pt-6 border-t border-white/5">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="p-3 bg-white/5 border border-white/10 rounded-xl disabled:opacity-10 hover:bg-white/10 hover:border-primary/40 transition-all text-primary"
          >
            <ChevronLeft size={20} strokeWidth={3} />
          </button>
          <div className="flex flex-col items-center min-w-[80px]">
            <span className="text-[11px] font-mono font-black tracking-widest uppercase text-slate-400">Node_ID</span>
            <span className="text-lg font-display font-black text-white">{currentPage} <span className="text-slate-400 text-sm">/</span> {totalPages}</span>
          </div>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="p-3 bg-white/5 border border-white/10 rounded-xl disabled:opacity-10 hover:bg-white/10 hover:border-primary/40 transition-all text-primary"
          >
            <ChevronRight size={20} strokeWidth={3} />
          </button>
        </div>
      )}

      <CreatePlaylistModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreatePlaylist} />
      <AddToPlaylistModal isOpen={isAddToPlaylistModalOpen} onClose={() => setIsAddToPlaylistModalOpen(false)} problemId={selectedProblemId} />
    </div>
  );
};

export default ProblemsTable;