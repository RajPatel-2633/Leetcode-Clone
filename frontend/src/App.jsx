import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import { useAuthStore } from "./store/useAuthStore";
import { useExecutionStore } from "./store/useExecution"; 
import { Loader2, Database } from "lucide-react";
import { Toaster } from "react-hot-toast";

import ProblemPage from "./pages/ProblemPage";
import Layout from "./components/Layout";

import AddProblem from "./pages/AddProblem";
import Profile from "./pages/Profile";
import AdminRoute from "./components/AdminRoute";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { submission } = useExecutionStore(); 
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /**
   * GLOBAL TELEMETRY GLOW
   * Swapped soft shadow for a more "Physical Hardware" glow effect
   */
  const getAmbientGlow = () => {
    if (!submission) return "";
    return submission.status === "Accepted" 
      ? "shadow-[inset_0_0_200px_rgba(16,185,129,0.15)] border-emerald-500/20" 
      : "shadow-[inset_0_0_200px_rgba(244,63,94,0.15)] border-rose-500/20";
  };

  // 1. Initial System Bootup Loader: Hardened & Straight
  if (isCheckingAuth && !authUser)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#050505] text-primary font-mono overflow-hidden">
        <div className="relative flex items-center justify-center">
            {/* Core Reactor Glow */}
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-[80px] animate-pulse" />
            <Loader2 className="size-16 animate-spin relative z-10 stroke-[3px]" />
            <div className="absolute -inset-10 border-2 border-white/5 rounded-full animate-[ping_3s_linear_infinite] opacity-10" />
        </div>
        <div className="mt-12 flex flex-col items-center gap-4">
            <h2 className="text-xl font-black font-display tracking-tight uppercase text-white">
              System_Boot_Sequence
            </h2>
            <div className="flex flex-col items-center gap-2">
                <p className="text-[10px] font-black tracking-[0.6em] uppercase text-primary/40 animate-pulse">
                  Initializing_Lab_OS_V4
                </p>
                <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-primary w-1/2 animate-[loading_1.5s_infinite_linear]" />
                </div>
            </div>
        </div>
      </div>
    );

  return (
    <div className={`h-screen w-full max-w-full overflow-x-hidden bg-[#050505] transition-all duration-1000 border-0 overflow-hidden relative ${getAmbientGlow()}`}>
      <Toaster 
        position="top-right"
        toastOptions={{
            duration: 4000,
            style: {
                background: '#080808',
                color: '#fff',
                border: '2px solid rgba(255,255,255,0.05)',
                padding: '16px 28px',
                fontSize: '11px',
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: '900',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                borderRadius: '4px', // Squared off for Brutalist feel
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            },
            success: {
              iconTheme: { primary: '#7480ff', secondary: '#000' },
              style: { borderLeft: '4px solid #7480ff' }
            },
            error: {
              iconTheme: { primary: '#f43f5e', secondary: '#000' },
              style: { borderLeft: '4px solid #f43f5e' }
            }
        }}
      />
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />

          <Route path="/" element={authUser ? <Layout /> : <Navigate to="/login" />}>
            <Route index element={<HomePage />} />
            <Route path="problem/:id" element={<ProblemPage />} />
            <Route path="profile" element={<Profile />} />
            <Route element={<AdminRoute />}>
              <Route path="add-problem" element={<AddProblem />} />
            </Route>
          </Route>
        </Routes>
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255,255,255,0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(116, 128, 255, 0.3);
        }
        /* Global Font Fixes to ensure "Straight" weights everywhere */
        body {
          font-style: normal !important;
        }
        h1, h2, h3, h4, button {
          font-style: normal !important;
          text-transform: uppercase !important;
        }
      `}} />
    </div>
  );
};

export default App;