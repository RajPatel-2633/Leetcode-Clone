import React from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FolderPlus, Terminal, CheckCircle2 } from 'lucide-react';

const CreatePlaylistModal = ({ isOpen, onClose, onSubmit }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
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
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* 2. Modal Body */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-[#121212] border border-white/10 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

            <div className="p-8 md:p-10">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl text-primary">
                    <FolderPlus size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">
                      New_Collection
                    </h3>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">
                      Initializing_Storage_Sector
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

              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Collection_Name
                  </label>
                  <input
                    type="text"
                    className={`w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none focus:border-primary/50 transition-all ${
                      errors.name ? "border-red-500/50" : ""
                    }`}
                    placeholder="ex. Dynamic Programming Mastery"
                    {...register('name', { required: 'Name is required' })}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-[9px] font-bold mt-1 ml-1 uppercase">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Description Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Scope_Description
                  </label>
                  <textarea
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-medium outline-none focus:border-primary/50 transition-all h-28 resize-none"
                    placeholder="Define the purpose of this dataset..."
                    {...register('description')}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={onClose} 
                    className="flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors"
                  >
                    Discard
                  </button>
                  <button 
                    type="submit" 
                    className="flex-[2] py-4 bg-primary text-black rounded-2xl font-black uppercase italic tracking-tighter shadow-[0_0_20px_rgba(var(--p),0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={18} />
                    Commit_Collection
                  </button>
                </div>
              </form>
            </div>
            
            {/* Subtle Terminal Branding */}
            <div className="absolute bottom-4 left-10 opacity-[0.03] pointer-events-none">
                <Terminal size={80} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreatePlaylistModal;