import React, { useEffect, useState } from 'react';
import { usePlaylistStore } from '../store/usePlaylistStore';
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
    <div className="space-y-12 pb-20">
      {/* 1. Header & Quick Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
        <div className="space-y-2">
          <h2 className="text-4xl font-black uppercase font-display tracking-tight text-white leading-none">
            Collections_Manifest
          </h2>
          <p className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.4em]">
            Archive_Sector: User_Playlists // Access_Level_01
          </p>
        </div>

        <div className="flex items-center gap-6 w-full md:w-auto">
            {/* Quick Stats Mini-Widget */}
            <div className="flex-1 md:flex-none flex items-center gap-8 bg-white/[0.03] border-2 border-white/5 px-8 py-4 rounded-2xl">
                <div className="text-left">
                    <p className="text-[8px] font-mono font-black text-slate-600 uppercase tracking-widest">Active_Manifests</p>
                    <p className="text-2xl font-black font-display text-primary">{playlists.length}</p>
                </div>
                <div className="w-[2px] h-10 bg-white/5" />
                <div className="text-left">
                    <p className="text-[8px] font-mono font-black text-slate-600 uppercase tracking-widest">Linked_Nodes</p>
                    <p className="text-2xl font-black font-display text-white">{totalProblems}</p>
                </div>
            </div>

            <button 
              className="flex items-center gap-3 px-8 py-5 bg-primary text-black rounded-2xl font-black uppercase tracking-tight shadow-[0_0_30px_rgba(var(--p),0.3)] hover:scale-[1.05] active:scale-95 transition-all font-display"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus size={20} strokeWidth={3} />
              New_Init
            </button>
        </div>
      </div>

      {/* 2. Playlist Feed */}
      {playlists.length === 0 ? (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="py-32 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]"
        >
          <Database size={48} className="mx-auto text-slate-800 mb-6" />
          <h3 className="text-slate-500 font-mono font-black uppercase tracking-[0.4em] text-xs">No collections initialized.</h3>
          <p className="text-slate-600 font-mono text-[10px] mt-2 uppercase tracking-widest">Awaiting data input to archive sector.</p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {playlists.map((playlist, index) => {
            const isExpanded = expandedPlaylist === playlist.id;
            return (
              <motion.div
                key={playlist.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`group border-2 transition-all duration-500 rounded-[2.5rem] overflow-hidden ${
                  isExpanded ? 'bg-white/[0.05] border-primary/40 shadow-[0_0_50px_rgba(0,0,0,0.6)]' : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                }`}
              >
                {/* Header Container */}
                <div 
                  className={`p-8 flex flex-col md:flex-row justify-between items-center cursor-pointer gap-6 transition-colors ${isExpanded ? 'bg-primary/[0.03]' : ''}`}
                  onClick={() => togglePlaylist(playlist.id)}
                >
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className={`p-5 rounded-2xl transition-all duration-500 border-2 ${isExpanded ? 'bg-primary text-black border-primary' : 'bg-white/5 text-primary border-white/5'}`}>
                      <BookOpen size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black uppercase font-display tracking-tight text-white group-hover:text-primary transition-colors leading-none">
                        {playlist.name}
                      </h3>
                      <div className="flex items-center gap-6 mt-3 text-[9px] font-mono font-black text-slate-600 uppercase tracking-[0.2em]">
                        <span className="flex items-center gap-2"><Activity size={12} className="text-primary"/> {playlist.problems.length} Nodes_Linked</span>
                        <span className="flex items-center gap-2"><Clock size={12}/> Init_Date: {new Date(playlist.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                    <p className="hidden md:block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest max-w-[250px] truncate">
                      {playlist.description || "NO_DESCRIPTION_LOGGED"}
                    </p>
                    <motion.div 
                      animate={{ rotate: isExpanded ? 180 : 0 }} 
                      className={`p-3 rounded-xl border-2 transition-all ${isExpanded ? 'bg-primary/20 border-primary/40' : 'bg-white/5 border-white/5'}`}
                    >
                      <ChevronDown size={20} className={isExpanded ? 'text-primary' : 'text-slate-600'} />
                    </motion.div>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t-2 border-white/5 bg-black/60"
                    >
                      <div className="p-10 space-y-10">
                        <div className="flex items-center justify-between border-b border-white/5 pb-6">
                            <div className="flex items-center gap-4">
                                <Terminal size={18} className="text-primary" />
                                <h4 className="text-[11px] font-mono font-black uppercase tracking-[0.4em] text-slate-400">Linked_Module_Payload</h4>
                            </div>
                            <span className="text-[9px] font-mono font-black text-slate-700 uppercase tracking-[0.4em]">Total_Records: {playlist.problems.length}</span>
                        </div>

                        {playlist.problems.length === 0 ? (
                          <div className="bg-white/[0.02] p-16 rounded-[2.5rem] text-center border-2 border-white/5">
                             <p className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-slate-700">Empty_Set: Initialize links to populate manifest.</p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto rounded-[2rem] border-2 border-white/5 bg-black/40">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-slate-600 border-b-2 border-white/5 bg-white/[0.02]">
                                  <th className="px-10 py-6">Identification</th>
                                  <th className="px-10 py-6">Difficulty</th>
                                  <th className="px-10 py-6 text-right">Operation</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y-2 divide-white/5">
                                {playlist.problems.map((item) => (
                                  <tr key={item.id} className="hover:bg-white/[0.03] transition-colors group/row">
                                    <td className="px-10 py-6">
                                      <p className="text-base font-black uppercase font-display tracking-tight text-white group-hover/row:text-primary transition-colors">{item.problem.title}</p>
                                      <div className="flex gap-4 mt-2">
                                        {item.problem.tags?.slice(0, 3).map((tag, idx) => (
                                          <span key={idx} className="text-[9px] font-mono font-black uppercase text-slate-600 tracking-widest border-b border-white/10 pb-0.5">#{tag}</span>
                                        ))}
                                      </div>
                                    </td>
                                    <td className="px-10 py-6">
                                      <span className={`px-4 py-1.5 rounded-xl text-[9px] font-mono font-black border-2 uppercase tracking-[0.2em] ${difficultyStyles[item.problem.difficulty]}`}>
                                        {item.problem.difficulty}
                                      </span>
                                    </td>
                                    <td className="px-10 py-6">
                                      <div className="flex justify-end items-center gap-4">
                                        <Link 
                                          to={`/problem/${item.problem.id}`} 
                                          className="p-4 bg-white/5 hover:bg-primary text-slate-500 hover:text-black rounded-2xl border-2 border-transparent transition-all"
                                        >
                                          <ExternalLink size={18} />
                                        </Link>
                                        <button
                                          onClick={() => handleRemoveProblem(playlist.id, item.problem.id)}
                                          className="p-4 bg-white/5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 rounded-2xl border-2 border-transparent transition-all"
                                        >
                                          <Trash2 size={18} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                        
                        <div className="pt-10 flex justify-end">
                           <button 
                             onClick={() => handleDelete(playlist.id)} 
                             className="group flex items-center gap-4 px-8 py-4 bg-rose-500/5 hover:bg-rose-500/10 border-2 border-rose-500/10 rounded-2xl transition-all"
                           >
                             <ShieldAlert size={18} className="text-rose-500 opacity-40 group-hover:opacity-100 transition-opacity" />
                             <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-rose-500/60 group-hover:text-rose-500">Purge_Manifest_Buffer</span>
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