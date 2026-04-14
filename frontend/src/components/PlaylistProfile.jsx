import React, { useEffect, useState } from 'react';
import { usePlaylistStore } from '../store/usePlaylistStore';
import { useAuthStore } from '../store/useAuthStore'; // Add this line
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, ChevronDown, Clock, List, Tag, 
  ExternalLink, Trash2, Plus, Terminal, Database, ShieldAlert, Activity
} from 'lucide-react';
import CreatePlaylistModal from './CreatePlaylistModal';

const PlaylistProfile = () => {
  const { getAllPlaylists, playlists, deletePlaylist, createPlaylist, removeProblemFromPlaylist } = usePlaylistStore();
  const [expandedPlaylist, setExpandedPlaylist] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { authUser } = useAuthStore();

  useEffect(() => {
    getAllPlaylists();
  }, [getAllPlaylists]);

  const togglePlaylist = (id) => {
    setExpandedPlaylist(expandedPlaylist === id ? null : id);
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Permanent Deletion: Are you sure?");
    if (ok) await deletePlaylist(id);
  };

  const handleCreatePlaylist = async (data) => {
    await createPlaylist(data);
    setIsCreateModalOpen(false);
  };

  const handleRemoveProblem = async (playlistId, problemId) => {
    const ok = window.confirm("Sever link between problem and collection?");
    if (!ok) return;
    await removeProblemFromPlaylist(playlistId, [problemId]);
    await getAllPlaylists();
  };

  const difficultyStyles = {
    EASY: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    MEDIUM: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    HARD: "text-rose-400 bg-rose-400/10 border-rose-400/20",
  };

  const totalProblems = playlists.reduce((acc, curr) => acc + curr.problems.length, 0);

  return (
    <div className="space-y-10 pb-20">
      {/* 1. Header & Quick Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-2 border-white/5 pb-8 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
              <div className="size-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.6)]" />
              <h2 className="text-3xl font-black  uppercase font-display tracking-tight text-white leading-none">
                LINK_STATUS: ESTABLISHED
              </h2>
            </div>
            <p className="text-[11px] font-mono font-black text-slate-400 uppercase tracking-[0.4em] pl-7">
             VIRTUAL_PATH: /ROOT/USER_{(authUser?.name || "GUEST").toUpperCase().replace(' ', '_')}/ARCHIVE/SETS
            </p>
          </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            {/* Quick Stats Mini-Widget */}
            <div className="flex items-center gap-6 bg-white/[0.03] border border-white/10 px-6 py-3 rounded-2xl w-full sm:w-auto">
                <div className="text-left">
                    <p className="text-[11px] font-mono font-black text-slate-400 uppercase tracking-widest">Active_Sets</p>
                    <p className="text-xl font-black font-display text-primary">{playlists.length}</p>
                </div>
                <div className="w-[1px] h-8 bg-white/10" />
                <div className="text-left">
                    <p className="text-[11px] font-mono font-black text-slate-400 uppercase tracking-widest">Linked_Nodes</p>
                    <p className="text-xl font-black font-display text-white">{totalProblems}</p>
                </div>
            </div>

            {/* FIXED: Added flex-shrink-0 to prevent button from being crushed/moved */}
            <button 
              className="flex-shrink-0 flex items-center justify-center gap-3 px-6 py-4 bg-primary text-black rounded-xl font-black uppercase tracking-tight shadow-[0_0_20px_rgba(var(--p),0.2)] hover:scale-[1.02] active:scale-95 transition-all font-display w-full sm:w-auto text-sm"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus size={18} strokeWidth={3} />
              New_Init
            </button>
        </div>
      </div>

      {/* 2. Playlist Feed */}
      {playlists.length === 0 ? (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="py-32 text-center border border-dashed border-white/10 rounded-[2rem] bg-white/[0.01]"
        >
          <Database size={40} className="mx-auto text-slate-400 mb-4" />
          <h3 className="text-slate-400 font-mono font-black uppercase tracking-[0.3em] text-sm">No collections initialized.</h3>
          <p className="text-slate-400 font-mono text-[10px] mt-2 uppercase tracking-widest">Awaiting data input to archive sector.</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {playlists.map((playlist, index) => {
            const isExpanded = expandedPlaylist === playlist.id;
            return (
              <motion.div
                key={playlist.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`group border transition-all duration-300 rounded-3xl overflow-hidden ${
                  isExpanded ? 'bg-white/[0.04] border-primary/30 shadow-2xl' : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                }`}
              >
                {/* Header Container */}
                <div 
                  className={`p-6 flex flex-col md:flex-row justify-between items-center cursor-pointer gap-4 ${isExpanded ? 'bg-primary/[0.02]' : ''}`}
                  onClick={() => togglePlaylist(playlist.id)}
                >
                  <div className="flex items-center gap-5 w-full md:w-auto">
                    <div className={`p-4 rounded-xl transition-all duration-300 border ${isExpanded ? 'bg-primary text-black border-primary' : 'bg-white/5 text-primary border-white/5'}`}>
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase font-display tracking-tight text-white group-hover:text-primary transition-colors">
                        {playlist.name}
                      </h3>
                      <div className="flex items-center gap-4 mt-1.5 text-[11px] font-mono font-black text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Activity size={10} className="text-primary"/> {playlist.problems.length} Nodes</span>
                        <span className="flex items-center gap-1.5"><Clock size={10}/> {new Date(playlist.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    <p className="hidden lg:block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest max-w-[200px] truncate opacity-60">
                      {playlist.description || "NO_DESC"}
                    </p>
                    <motion.div 
                      animate={{ rotate: isExpanded ? 180 : 0 }} 
                      className={`p-2 rounded-lg border transition-all ${isExpanded ? 'bg-primary/10 border-primary/30' : 'bg-white/5 border-white/5'}`}
                    >
                      <ChevronDown size={16} className={isExpanded ? 'text-primary' : 'text-slate-400'} />
                    </motion.div>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/5 bg-black/40"
                    >
                      <div className="p-6 md:p-8 space-y-8">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <div className="flex items-center gap-3">
                                <Terminal size={14} className="text-primary" />
                                <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-300">Linked_Payload</h4>
                            </div>
                            <span className="text-[11px] font-mono font-black text-slate-400 uppercase tracking-widest">Records: {playlist.problems.length}</span>
                        </div>

                        {playlist.problems.length === 0 ? (
                          <div className="bg-white/[0.01] p-10 rounded-2xl text-center border border-white/5">
                             <p className="text-[11px] font-mono font-black uppercase tracking-widest text-slate-400">Empty_Set: Initialize links to populate.</p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto rounded-xl border border-white/5 bg-black/20">
                            <table className="w-full text-left border-collapse min-w-[500px]">
                              <thead>
                                <tr className="text-[11px] font-mono font-black uppercase tracking-widest text-slate-400 border-b border-white/5 bg-white/[0.02]">
                                  <th className="px-6 py-4">Identification</th>
                                  <th className="px-6 py-4">Difficulty</th>
                                  <th className="px-6 py-4 text-right">Operation</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                {playlist.problems.map((item) => (
                                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group/row">
                                    <td className="px-6 py-4">
                                      <p className="text-sm font-black uppercase font-display tracking-tight text-white group-hover/row:text-primary transition-colors">{item.problem.title}</p>
                                      <div className="flex gap-3 mt-1">
                                        {item.problem.tags?.slice(0, 3).map((tag, idx) => (
                                          <span key={idx} className="text-[11px] font-mono font-black uppercase text-slate-400 tracking-widest">#{tag}</span>
                                        ))}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <span className={`px-3 py-1 rounded-lg text-[11px] font-mono font-black border uppercase tracking-widest ${difficultyStyles[item.problem.difficulty]}`}>
                                        {item.problem.difficulty}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="flex justify-end items-center gap-3">
                                        <Link 
                                          to={`/problem/${item.problem.id}`} 
                                          className="p-2.5 bg-white/5 hover:bg-primary text-slate-400 hover:text-black rounded-lg border border-transparent transition-all"
                                        >
                                          <ExternalLink size={16} />
                                        </Link>
                                        <button
                                          onClick={() => handleRemoveProblem(playlist.id, item.problem.id)}
                                          className="p-2.5 bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-lg border border-transparent transition-all"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                        
                        <div className="pt-6 flex justify-end">
                            <button 
                               onClick={() => handleDelete(playlist.id)} 
                               className="group flex items-center gap-3 px-6 py-3 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 rounded-xl transition-all"
                            >
                               <ShieldAlert size={16} className="text-rose-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                               <span className="text-[11px] font-mono font-black uppercase tracking-widest text-rose-500">Purge_Manifest</span>
                            </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      <CreatePlaylistModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePlaylist}
      />
    </div>
  );
};

export default PlaylistProfile;