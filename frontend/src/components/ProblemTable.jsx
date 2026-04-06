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
  ChevronRight
} from "lucide-react";
import { useActions } from "../store/useAction";
import AddToPlaylistModal from "./AddToPlaylist";
import CreatePlaylistModal from "./CreatePlaylistModal";
import { usePlaylistStore } from "../store/usePlaylistStore";

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

  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];
    const tagsSet = new Set();
    problems.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
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
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase">Datasets</h2>
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase">Select a module to begin</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-white/5 hover:bg-primary hover:text-black border border-white/10 px-6 py-3 rounded-xl font-black uppercase italic tracking-tighter transition-all duration-300 shadow-lg group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform" />
          Create Playlist
        </button>
      </div>

      {/* 2. Advanced Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/[0.03] p-4 rounded-2xl border border-white/5">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search problems..."
            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 transition-all"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <select
            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none appearance-none cursor-pointer focus:border-primary/50"
            value={difficulty}
            onChange={(e) => { setDifficulty(e.target.value); setCurrentPage(1); }}
          >
            <option value="ALL">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
        <select
          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 outline-none appearance-none cursor-pointer focus:border-primary/50"
          value={selectedTag}
          onChange={(e) => { setSelectedTag(e.target.value); setCurrentPage(1); }}
        >
          <option value="ALL">All Tags</option>
          {allTags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
        </select>
      </div>

      {/* 3. The List (Formerly Table) */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {paginatedProblems.length > 0 ? (
            paginatedProblems.map((problem, index) => {
              const isSolved = problem.solvedby?.some((ps) => ps.userId === authUser?.id);
              return (
                <motion.div
                  key={problem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex flex-col md:flex-row items-center justify-between p-5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-primary/30 rounded-2xl transition-all duration-300"
                >
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className={isSolved ? "text-primary" : "text-slate-700"}>
                      {isSolved ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    </div>
                    <div>
                      <Link 
                        to={`/problem/${problem.id}`} 
                        className="text-lg font-bold tracking-tight group-hover:text-primary transition-colors"
                      >
                        {problem.title}
                      </Link>
                      <div className="flex gap-2 mt-1">
                        {problem.tags?.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white/5 px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-4 md:mt-0">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest border ${difficultyStyles[problem.difficulty]}`}>
                      {problem.difficulty}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAddToPlaylist(problem.id)}
                        className="p-2 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                      >
                        <Bookmark size={18} />
                      </button>
                      {authUser?.role === "ADMIN" && (
                        <button
                          onClick={() => onDeleteProblem(problem.id)}
                          className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-20 opacity-30">
              <p className="text-xl font-black uppercase italic tracking-tighter">No active modules found.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Minimalist Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="p-2 border border-white/10 rounded-xl disabled:opacity-20 hover:bg-white/5 transition-all"
          >
            <ChevronLeft />
          </button>
          <span className="text-xs font-black tracking-widest uppercase text-slate-500">
            Node {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="p-2 border border-white/10 rounded-xl disabled:opacity-20 hover:bg-white/5 transition-all"
          >
            <ChevronRight />
          </button>
        </div>
      )}

      {/* Modals remain functionally the same */}
      <CreatePlaylistModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreatePlaylist} />
      <AddToPlaylistModal isOpen={isAddToPlaylistModalOpen} onClose={() => setIsAddToPlaylistModalOpen(false)} problemId={selectedProblemId} />
    </div>
  );
};

export default ProblemsTable;