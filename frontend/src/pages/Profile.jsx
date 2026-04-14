import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Mail, User, Shield, Image as ImageIcon, 
  Edit3, CheckCircle2, Code2, BookOpen, ThumbsUp, 
  Terminal, Activity, Zap, Lock 
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useProblemStore } from "../store/useProblemStore";
import { useSubmissionStore } from "../store/useSubmissionStore";
import { usePlaylistStore } from "../store/usePlaylistStore";
import ProfileSubmission from "../components/ProfileSubmission";
import ProblemSolvedByUser from "../components/ProblemSolvedByUser";
import PlaylistProfile from "../components/PlaylistProfile";

const Profile = () => {
  const { authUser } = useAuthStore();
  const { solvedProblems } = useProblemStore();
  const { submissions, getAllSubmissions } = useSubmissionStore();
  const { playlists } = usePlaylistStore();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: authUser?.name || "",
    image: authUser?.image || ""
  });
  
  const [statistics, setStatistics] = useState({
    problemsSolved: 0,
    totalSubmissions: 0,
    playlistsCreated: 0,
    successRate: 0
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    if (authUser) getAllSubmissions(false);
  }, [authUser, getAllSubmissions]);

  useEffect(() => {
    if (authUser) {
      const problemsSolved = solvedProblems.length;
      const totalSubmissions = submissions.length;
      const playlistsCreated = playlists.length;
      const successfulSubmissions = submissions.filter(sub => sub.status === "Accepted").length;
      const successRate = totalSubmissions > 0 ? Math.round((successfulSubmissions / totalSubmissions) * 100) : 0;

      setStatistics({ problemsSolved, totalSubmissions, playlistsCreated, successRate });
      setIsLoadingStats(false);
    }
  }, [authUser, solvedProblems, playlists, submissions]);

  const statsConfig = [
    { label: "SOLVED", value: statistics.problemsSolved, icon: CheckCircle2, color: "text-emerald-400" },
    { label: "SUBMISSIONS", value: statistics.totalSubmissions, icon: Code2, color: "text-blue-400" },
    { label: "PLAYLISTS", value: statistics.playlistsCreated, icon: BookOpen, color: "text-purple-400" },
    { label: "ACCURACY", value: `${statistics.successRate}%`, icon: ThumbsUp, color: "text-amber-400" },
  ];

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#050505] text-white py-8 md:py-12 px-4 sm:px-6 font-primary flex flex-col items-start">
      {/* 1. Page Header: Straight & Heavy */}
      <div className="w-full max-w-full mb-12 md:mb-16 flex flex-wrap items-start justify-between gap-6 border-b-2 border-white/5 pb-8 md:pb-10">
        <div className="flex items-center gap-6 md:gap-8 min-w-0">
          <Link to="/" className="p-4 bg-white/5 border-2 border-white/5 rounded-2xl hover:border-primary/40 transition-all group">
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" strokeWidth={3} />
          </Link>
          <div className="space-y-1">
            <h1 className="text-5xl font-black uppercase font-display tracking-tight leading-none">
              IDENTITY<span className="text-primary">.</span>
            </h1>
            <p className="text-slate-400 font-mono text-[10px] font-black tracking-[0.5em] uppercase">
              SECTOR: USER_PROFILE_BUFFER // 0xAF42
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 px-6 py-2.5 bg-primary/5 border-2 border-primary/20 rounded-full shadow-[0_0_20px_rgba(var(--p),0.1)]">
            <Activity size={16} strokeWidth={3} className="text-primary animate-pulse" />
            <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-primary">System_Active</span>
        </div>
      </div>

      <div className="w-full max-w-full grid grid-cols-1 lg:grid-cols-[minmax(0,380px)_1fr] gap-8 lg:gap-12 items-start">
        
        {/* 2. Left Sidebar: Biometric Interface */}
        <div className="w-full max-w-full min-w-0 space-y-6">
          <div className="bg-[#080808] border-2 border-white/5 rounded-[2.5rem] p-6 md:p-8 backdrop-blur-md lg:sticky lg:top-28 shadow-2xl overflow-hidden w-full min-w-0">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
            
            <div className="relative flex flex-col items-start text-left z-10 w-full min-w-0">
              <div className="relative group mb-8 self-center">
                {/* Scanner Glow */}
                <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full group-hover:bg-primary/20 transition-all" />
                <div className="relative size-40 rounded-full border-4 border-primary p-2 shadow-[0_0_30px_rgba(var(--p),0.2)]">
                    <div className="w-full h-full rounded-full bg-neutral-900 overflow-hidden flex items-center justify-center border-2 border-white/10">
                        {authUser?.image ? (
                            <img src={authUser.image} alt="User" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                        ) : (
                            <span className="text-5xl font-black font-display text-primary">{authUser?.name?.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    {/* Biometric Corner Accents */}
                    <div className="absolute top-0 right-0 size-4 border-t-2 border-r-2 border-white/40" />
                    <div className="absolute bottom-0 left-0 size-4 border-b-2 border-l-2 border-white/40" />
                </div>
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="absolute bottom-2 right-2 p-3 bg-primary text-black rounded-2xl shadow-2xl hover:scale-110 active:scale-90 transition-all border-2 border-black/20"
                >
                  <Edit3 size={18} strokeWidth={3} />
                </button>
              </div>

              <h2 className="text-3xl font-black tracking-tight uppercase font-display text-white leading-none w-full">
                {authUser?.name || "ANONYMOUS_UNIT"}
              </h2>
              <div className="mt-4 px-4 py-1.5 bg-white/[0.03] border-2 border-white/5 rounded-xl text-[10px] font-mono font-black uppercase tracking-[0.4em] text-slate-400 w-full">
                AUTH_ROLE: {authUser?.role || "USER"}
              </div>

              <div className="w-full space-y-4 mt-12">
                <div className="flex items-center gap-5 p-5 bg-black/40 rounded-2xl border-2 border-white/5 group hover:border-primary/20 transition-colors">
                   <div className="p-2 bg-primary/5 rounded-lg border border-primary/10">
                    <Mail className="text-primary" size={20} strokeWidth={2.5} />
                   </div>
                   <div className="text-left">
                      <p className="text-[11px] font-mono font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Email_Endpoint</p>
                      <p className="text-xs font-bold font-mono break-all text-slate-300 min-w-0 max-w-full">{authUser?.email}</p>
                   </div>
                </div>
                <div className="flex items-center gap-5 p-5 bg-black/40 rounded-2xl border-2 border-white/5 group hover:border-primary/20 transition-colors">
                   <div className="p-2 bg-primary/5 rounded-lg border border-primary/10">
                    <Shield className="text-primary" size={20} strokeWidth={2.5} />
                   </div>
                   <div className="text-left">
                      <p className="text-[11px] font-mono font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Clearance_Level</p>
                      <p className="text-xs font-bold font-mono uppercase text-slate-300">
                        {authUser?.role === "ADMIN" ? "RESTRICTED_ROOT" : "STANDARD_OPERATIVE"}
                      </p>
                   </div>
                </div>
              </div>

              <button className="w-full mt-8 py-5 bg-white/[0.03] border-2 border-white/5 rounded-2xl text-[10px] font-mono font-black uppercase tracking-[0.3em] text-slate-400 hover:bg-white/[0.06] hover:text-white transition-all flex items-center justify-start gap-3 px-4">
                <Lock size={16} strokeWidth={3} /> CHANGE_ACCESS_KEYS
              </button>
            </div>
          </div>
        </div>

        {/* 3. Main Content: Hardware Telemetry */}
        <div className="w-full max-w-full min-w-0 space-y-10 md:space-y-12">
          {/* Stats Grid */}
          <div className="w-full max-w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsConfig.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="w-full min-w-0 max-w-full bg-white/[0.02] border-2 border-white/5 p-6 sm:p-8 rounded-[2rem] backdrop-blur-md group hover:border-primary/40 transition-all shadow-xl"
              >
                <stat.icon className={`${stat.color} mb-4 group-hover:scale-125 transition-transform`} size={24} strokeWidth={2.5} />
                <div className="text-2xl md:text-4xl font-black font-display tracking-tight text-white leading-tight break-all whitespace-normal min-w-0">
                  {isLoadingStats ? "..." : stat.value}
                </div>
                <div className="text-[11px] font-mono font-black text-slate-400 uppercase tracking-[0.4em] mt-3">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Activity Sections */}
          <div className="space-y-24 pt-4 w-full">
  
              {/* 1. SUBMISSIONS SECTION */}
              <section className="relative w-full">
                  <div className="space-y-2 mb-10">
                    <h2 className="text-4xl font-black uppercase font-display tracking-tight text-white leading-none">
                      SUBMISSIONS_LOG
                    </h2>
                    <p className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-[0.4em]">
                      DATA_SECTOR: EXECUTION_HISTORY // NODE_01
                    </p>
                  </div>
                  <div className="bg-[#080808]/50 rounded-[2.5rem] border-2 border-white/5 p-8 shadow-inner w-full overflow-hidden">
                    <ProfileSubmission />
                  </div>
              </section>

              {/* 2. SOLVED MODULES SECTION */}
              <section className="relative w-full">
                  <div className="space-y-2 mb-10">
                    <h2 className="text-4xl font-black uppercase font-display tracking-tight text-white leading-none">
                      SOLVED_MODULES
                    </h2>
                    <p className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-[0.4em]">
                      DATA_SECTOR: COMPLETED_PROTOCOLS // ARCHIVE_01
                    </p>
                  </div>
                  <div className="bg-[#080808]/50 rounded-[2.5rem] border-2 border-white/5 p-8 shadow-inner w-full overflow-hidden">
                    <ProblemSolvedByUser />
                  </div>
              </section>

              {/* 3. COLLECTIONS SECTION */}
              <section className="relative w-full">
                  <div className="space-y-2 mb-10">
                    <h2 className="text-4xl font-black uppercase font-display tracking-tight text-white leading-none">
                      COLLECTIONS_MANIFEST
                    </h2>
                    <p className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-[0.4em]">
                      DATA_SECTOR: USER_PLAYLISTS // ACCESS_LEVEL_01
                    </p>
                  </div>
                  <div className="bg-[#080808]/50 rounded-[2.5rem] border-2 border-white/5 p-8 shadow-inner w-full overflow-hidden">
                    <PlaylistProfile />
                  </div>
              </section>
            </div>
        </div>
      </div>

      {/* 4. Edit Modal: Hardened Interface */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-[#080808] border-2 border-white/10 w-full max-w-md rounded-[2rem] p-12 shadow-[0_0_80px_rgba(0,0,0,1)] overflow-hidden"
            >
              {/* Hardware Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
              
              <h3 className="text-3xl font-black uppercase font-display tracking-tight mb-10 text-white">PATCH_PROFILE</h3>
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-slate-400 ml-1">HANDLE_ID</label>
                  <input
                    type="text"
                    className="w-full bg-white/[0.03] border-2 border-white/5 rounded-2xl p-5 font-mono text-sm focus:border-primary/50 outline-none transition-all text-white font-bold"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-slate-400 ml-1">VISUAL_PATH_URL</label>
                  <input
                    type="url"
                    className="w-full bg-white/[0.03] border-2 border-white/5 rounded-2xl p-5 font-mono text-sm focus:border-primary/50 outline-none transition-all text-white font-bold"
                    value={editForm.image}
                    onChange={(e) => setEditForm({...editForm, image: e.target.value})}
                  />
                </div>
                <div className="flex gap-6 pt-6">
                  <button onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 text-[11px] font-mono font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors">
                    ABORT
                  </button>
                  <button className="flex-[2] py-4 bg-primary text-black rounded-2xl text-[11px] font-mono font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all" onClick={() => setIsEditModalOpen(false)}>
                    APPLY_PATCH
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;