import React, { useEffect, useState } from 'react';
import { usePlaylistStore } from '../store/usePlaylistStore';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, ChevronDown, Clock, List, Tag, 
  ExternalLink, Trash2, Plus, Terminal, Database, ShieldAlert 
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

  return (
    <div className="space-y-8">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">Collections_Manifest</h2>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sector: User_Playlists</p>
        </div>
        <button 
          className="flex items-center gap-2 px-6 py-3 bg-primary text-black rounded-xl font-black uppercase italic tracking-tighter shadow-[0_0_20px_rgba(var(--p),0.3)] hover:scale-[1.02] transition-all"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={18} />
          Create_New
        </button>
      </div>

      {/* 2. Playlist Feed */}
      {playlists.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
          <Database size={40} className="mx-auto text-slate-700 mb-4" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">No collections initialized.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {playlists.map((playlist, index) => {
            const isExpanded = expandedPlaylist === playlist.id;
            return (
              <motion.div
                key={playlist.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`group border transition-all duration-500 rounded-[1.5rem] overflow-hidden ${
                  isExpanded ? 'bg-white/[0.04] border-primary/30' : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                }`}
              >
                {/* Playlist Entry Header */}
                <div 
                  className="p-6 flex flex-col md:flex-row justify-between items-center cursor-pointer gap-6"
                  onClick={() => togglePlaylist(playlist.id)}
                >
                  <div className="flex items-center gap-5 w-full md:w-auto">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black italic uppercase tracking-tight text-white group-hover:text-primary transition-colors">
                        {playlist.name}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><List size={12}/> {playlist.problems.length} Nodes</span>
                        <span className="flex items-center gap-1.5"><Clock size={12}/> {new Date(playlist.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <p className="hidden md:block text-xs font-medium text-slate-400 italic max-w-xs truncate">
                      {playlist.description || "No classification data."}
                    </p>
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                      <ChevronDown className={isExpanded ? 'text-primary' : 'text-slate-600'} />
                    </motion.div>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/5 bg-black/40"
                    >
                      <div className="p-6 md:p-8 space-y-6">
                        <div className="flex items-center gap-3">
                           <Terminal size={14} className="text-primary" />
                           <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Assigned_Modules</h4>
                        </div>

                        {playlist.problems.length === 0 ? (
                          <div className="bg-white/5 p-8 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest text-slate-600 italic">
                             Warning: Collection is currently empty.
                          </div>
                        ) : (
                          <div className="overflow-x-auto rounded-2xl border border-white/5">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-white/[0.02] text-[9px] font-black uppercase tracking-widest text-slate-500 border-b border-white/5">
                                  <th className="px-6 py-4">Module</th>
                                  <th className="px-6 py-4">Difficulty</th>
                                  <th className="px-6 py-4">Tags</th>
                                  <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                {playlist.problems.map((item) => (
                                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group/row">
                                    <td className="px-6 py-4 text-sm font-bold text-white group-hover/row:text-primary transition-colors">
                                      {item.problem.title}
                                    </td>
                                    <td className="px-6 py-4">
                                      <span className={`px-3 py-0.5 rounded-md text-[8px] font-black border uppercase ${difficultyStyles[item.problem.difficulty]}`}>
                                        {item.problem.difficulty}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="flex gap-1.5">
                                        {item.problem.tags?.slice(0, 2).map((tag, idx) => (
                                          <span key={idx} className="text-[8px] font-black uppercase bg-white/5 px-2 py-1 rounded text-slate-500">
                                            {tag}
                                          </span>
                                        ))}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="flex justify-end items-center gap-3">
                                        <Link 
                                          to={`/problem/${item.problem.id}`} 
                                          className="p-2 bg-white/5 hover:bg-primary text-slate-400 hover:text-black rounded-lg transition-all"
                                        >
                                          <ExternalLink size={14} />
                                        </Link>
                                        <button
                                          onClick={() => handleRemoveProblem(playlist.id, item.problem.id)}
                                          className="p-2 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 rounded-lg transition-all"
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                        
                        <div className="pt-4 border-t border-white/5 flex justify-end">
                           <button 
                             onClick={() => handleDelete(playlist.id)} 
                             className="flex items-center gap-2 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-rose-500/50 hover:text-rose-500 transition-colors"
                           >
                             <ShieldAlert size={14} />
                             Purge_Collection
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