import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Loader2, Database, Link as LinkIcon } from 'lucide-react';
import { usePlaylistStore } from '../store/usePlaylistStore';

const AddToPlaylistModal = ({ isOpen, onClose, problemId }) => {
  const { playlists, getAllPlaylists, addProblemToPlaylist, isLoading } = usePlaylistStore();
  const [selectedPlaylist, setSelectedPlaylist] = useState('');

  useEffect(() => {
    if (isOpen) {
      getAllPlaylists();
    }
  }, [isOpen, getAllPlaylists]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlaylist) return;

    await addProblemToPlaylist(selectedPlaylist, [problemId]);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[200] p-4">
          {/* 1. Blurred Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* 2. Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-[#121212] border border-white/10 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            {/* Header Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

            <div className="p-8 md:p-10">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl text-primary">
                    <LinkIcon size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">
                      Link_Module
                    </h3>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">
                      Problem_ID: {problemId?.slice(-6) || "NULL"}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={onClose} 
                  className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    <Database size={12} className="text-primary" />
                    Target_Collection
                  </label>
                  <div className="relative group">
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-10 text-sm font-bold outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                      value={selectedPlaylist}
                      onChange={(e) => setSelectedPlaylist(e.target.value)}
                      disabled={isLoading}
                    >
                      <option value="" className="bg-[#121212]">Select a collection</option>
                      {playlists.map((playlist) => (
                        <option key={playlist.id} value={playlist.id} className="bg-[#121212]">
                          {playlist.name}
                        </option>
                      ))}
                    </select>
                    {/* Custom Select Arrow */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                        <Plus size={16} className="rotate-45" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <button 
                    type="button" 
                    onClick={onClose} 
                    className="flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors"
                  >
                    Abort_Link
                  </button>
                  <button 
                    type="submit" 
                    disabled={!selectedPlaylist || isLoading}
                    className="flex-[2] relative group py-4 bg-primary disabled:bg-white/5 disabled:text-slate-600 text-black rounded-2xl font-black uppercase italic tracking-tighter shadow-[0_0_20px_rgba(var(--p),0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 overflow-hidden"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Plus size={18} />
                        Confirm_Link
                      </>
                    )}
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </button>
                </div>
              </form>
            </div>

            {/* Bottom Glow Decoration */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-primary/20 blur-sm" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddToPlaylistModal;