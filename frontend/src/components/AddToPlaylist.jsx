import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Loader2, Database, Link as LinkIcon, ChevronDown } from 'lucide-react';
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
          {/* 1. Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* 2. Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative bg-[#080808] border-2 border-white/5 w-full max-w-md rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]"
          >
            {/* Top Security Accent */}
            <div className="h-1.5 w-full bg-primary/20">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                className="h-full bg-primary"
              />
            </div>

            <div className="p-8 md:p-12">
              {/* Header */}
              <div className="flex justify-between items-start mb-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary border border-primary/20">
                      <LinkIcon size={18} />
                    </div>
                    <span className="text-[10px] font-mono font-black text-primary uppercase tracking-[0.3em]">
                      Security_Link
                    </span>
                  </div>
                  <h3 className="text-3xl font-black uppercase font-display tracking-tight text-white leading-none">
                    Link_Module
                  </h3>
                  <p className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-2">
                    Target_UID: <span className="text-slate-400">{problemId?.slice(-8).toUpperCase() || "NULL_PTR"}</span>
                  </p>
                </div>
                <button 
                  onClick={onClose} 
                  className="p-2 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-mono font-black uppercase tracking-[0.4em] text-slate-400 ml-1">
                    <Database size={12} className="text-primary" />
                    Target_Collection
                  </label>
                  <div className="relative group">
                    <select
                      className="w-full bg-white/[0.03] border-2 border-white/5 rounded-2xl p-5 text-sm font-mono font-bold text-white outline-none focus:border-primary/40 transition-all appearance-none cursor-pointer"
                      value={selectedPlaylist}
                      onChange={(e) => setSelectedPlaylist(e.target.value)}
                      disabled={isLoading}
                    >
                      <option value="" className="bg-[#080808]">-- SELECT_MANIFEST --</option>
                      {playlists.map((playlist) => (
                        <option key={playlist.id} value={playlist.id} className="bg-[#080808] py-4">
                          {playlist.name.toUpperCase()}
                        </option>
                      ))}
                    </select>
                    
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-primary transition-colors">
                        <ChevronDown size={20} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <button 
                    type="submit" 
                    disabled={!selectedPlaylist || isLoading}
                    className="w-full relative group py-5 bg-primary disabled:bg-white/5 disabled:text-slate-400 text-black rounded-2xl font-black uppercase tracking-tight shadow-[0_0_30px_rgba(var(--p),0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 overflow-hidden font-display text-lg"
                  >
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-black" />
                    ) : (
                      <>
                        <Plus size={22} strokeWidth={3} />
                        Confirm_Injection
                      </>
                    )}
                  </button>
                  
                  <button 
                    type="button" 
                    onClick={onClose} 
                    className="w-full py-2 text-[10px] font-mono font-black uppercase tracking-[0.5em] text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    Abort_Protocol
                  </button>
                </div>
              </form>
            </div>

            {/* Side UI Decoration */}
            <div className="absolute top-1/2 -right-4 h-32 w-1 bg-primary/10 rounded-full" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddToPlaylistModal;