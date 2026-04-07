import React from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FolderPlus, Terminal, CheckCircle2, Database } from 'lucide-react';

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
          {/* 1. Industrial Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* 2. Modal Body */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative bg-[#080808] border-2 border-white/5 w-full max-w-md rounded-[1.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]"
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
              {/* Header Area */}
              <div className="flex justify-between items-start mb-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary border border-primary/20">
                      <FolderPlus size={18} />
                    </div>
                    <span className="text-[10px] font-mono font-black text-primary uppercase tracking-[0.4em]">
                      Archive_Init
                    </span>
                  </div>
                  <h3 className="text-3xl font-black uppercase font-display tracking-tight text-white leading-none">
                    New_Collection
                  </h3>
                  <p className="text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest mt-2">
                    Status: <span className="text-emerald-500/70">AWAITING_PARAMETERS</span>
                  </p>
                </div>
                <button 
                  onClick={onClose} 
                  className="p-2 bg-white/5 hover:bg-rose-500/20 text-slate-500 hover:text-rose-500 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
                {/* Name Input */}
                <div className="space-y-3">
                  <label className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-slate-500 ml-1">
                    Manifest_Title
                  </label>
                  <input
                    type="text"
                    className={`w-full bg-white/[0.03] border-2 border-white/5 rounded-2xl p-5 text-sm font-mono font-bold text-white outline-none focus:border-primary/40 transition-all ${
                      errors.name ? "border-rose-500/50" : ""
                    }`}
                    placeholder="EX. DYNAMIC_PROGRAMMING_V1"
                    {...register('name', { required: 'Title is required' })}
                  />
                  {errors.name && (
                    <p className="text-rose-500 text-[9px] font-black mt-1 ml-2 uppercase tracking-tighter">
                      [ERROR]: {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Description Input */}
                <div className="space-y-3">
                  <label className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-slate-500 ml-1">
                    Sector_Description
                  </label>
                  <textarea
                    className="w-full bg-white/[0.03] border-2 border-white/5 rounded-2xl p-5 text-sm font-mono font-medium text-slate-300 outline-none focus:border-primary/40 transition-all h-32 resize-none leading-relaxed"
                    placeholder="Define the scope of this archived dataset..."
                    {...register('description')}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4 pt-4">
                  <button 
                    type="submit" 
                    className="w-full py-5 bg-primary text-black rounded-2xl font-black uppercase tracking-tight shadow-[0_0_30px_rgba(var(--p),0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 font-display text-lg"
                  >
                    <CheckCircle2 size={22} strokeWidth={3} />
                    Commit_Collection
                  </button>
                  
                  <button 
                    type="button" 
                    onClick={onClose} 
                    className="w-full py-2 text-[10px] font-mono font-black uppercase tracking-[0.5em] text-slate-600 hover:text-rose-500 transition-colors"
                  >
                    Discard_Protocol
                  </button>
                </div>
              </form>
            </div>
            
            {/* Background Terminal Decoration */}
            <div className="absolute -bottom-10 -right-10 opacity-[0.02] pointer-events-none text-white">
              <Database size={200} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreatePlaylistModal;