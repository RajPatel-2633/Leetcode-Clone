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
    { label: "Solved", value: statistics.problemsSolved, icon: CheckCircle2, color: "text-emerald-400" },
    { label: "Submissions", value: statistics.totalSubmissions, icon: Code2, color: "text-blue-400" },
    { label: "Playlists", value: statistics.playlistsCreated, icon: BookOpen, color: "text-purple-400" },
    { label: "Accuracy", value: `${statistics.successRate}%`, icon: ThumbsUp, color: "text-amber-400" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white py-12 px-4">
      {/* 1. Page Header */}
      <div className="max-w-6xl mx-auto mb-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group">
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">Identity.</h1>
            <p className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase mt-1">User_Profile_Buffer</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/20 rounded-full">
            <Activity size={14} className="text-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">System Active</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8">
        
        {/* 2. Left Sidebar: Personal Info */}
        <div className="space-y-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-md sticky top-28">
            <div className="flex flex-col items-center text-center">
              <div className="relative group mb-6">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full group-hover:bg-primary/40 transition-all" />
                <div className="relative size-32 rounded-full border-2 border-primary p-1">
                    <div className="w-full h-full rounded-full bg-neutral overflow-hidden flex items-center justify-center">
                        {authUser?.image ? (
                            <img src={authUser.image} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-4xl font-black">{authUser?.name?.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                </div>
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="absolute bottom-0 right-0 p-2 bg-primary text-black rounded-xl shadow-lg hover:scale-110 transition-transform"
                >
                  <Edit3 size={16} />
                </button>
              </div>

              <h2 className="text-2xl font-black tracking-tight italic uppercase">{authUser?.name || "Anonymous"}</h2>
              <div className="mt-2 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400">
                {authUser?.role || "USER"}
              </div>

              <div className="w-full space-y-4 mt-10">
                <div className="flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-white/5">
                   <Mail className="text-primary" size={20} />
                   <div className="text-left">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Email_Endpoint</p>
                      <p className="text-xs font-bold truncate max-w-[180px]">{authUser?.email}</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-white/5">
                   <Shield className="text-primary" size={20} />
                   <div className="text-left">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Access_Level</p>
                      <p className="text-xs font-bold uppercase">{authUser?.role === "ADMIN" ? "Restricted Root" : "Standard Operator"}</p>
                   </div>
                </div>
              </div>

              <button className="w-full mt-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <Lock size={14} /> Change Access Keys
              </button>
            </div>
          </div>
        </div>

        {/* 3. Main Content: Stats & Submissions */}
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statsConfig.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl backdrop-blur-sm group hover:border-primary/30 transition-all"
              >
                <stat.icon className={`${stat.color} mb-3 group-hover:scale-110 transition-transform`} size={20} />
                <div className="text-3xl font-black italic tracking-tighter">
                  {isLoadingStats ? "..." : stat.value}
                </div>
                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sub-Components Sections */}
          <div className="space-y-12 pt-4">
            <section>
                <div className="flex items-center gap-4 mb-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Submissions_Log</h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                </div>
                <ProfileSubmission />
            </section>

            <section>
                <div className="flex items-center gap-4 mb-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Solved_Modules</h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                </div>
                <ProblemSolvedByUser />
            </section>

            <section>
                <div className="flex items-center gap-4 mb-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Collections</h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                </div>
                <PlaylistProfile />
            </section>
          </div>
        </div>
      </div>

      {/* 4. Edit Modal - Themed */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-[#121212] border border-white/10 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl"
            >
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8">Patch_Profile</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Handle</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary outline-none transition-all"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Visual_Path (URL)</label>
                  <input
                    type="url"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary outline-none transition-all"
                    value={editForm.image}
                    onChange={(e) => setEditForm({...editForm, image: e.target.value})}
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Abort</button>
                  <button className="flex-[2] py-4 bg-primary text-black rounded-xl text-[10px] font-black uppercase tracking-widest" onClick={() => setIsEditModalOpen(false)}>Save Changes</button>
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