import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import { useAuthStore } from "./store/useAuthStore";
import { useExecutionStore } from "./store/useExecution"; // Added for global feedback
import { Loader2 } from "lucide-react";
import { Toaster } from "react-hot-toast";

import ProblemPage from "./pages/ProblemPage";
import Layout from "./components/Layout";

import AddProblem from "./pages/AddProblem";
import Profile from "./pages/Profile";
import AdminRoute from "./components/AdminRoute";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { submission } = useExecutionStore(); // Access execution result for the glow effect
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /**
   * GLOBAL FEEDBACK SYSTEM
   * This determines if the entire app background should "flash" a color
   * based on the code execution result.
   */
  const getAmbientGlow = () => {
    if (!submission) return "";
    return submission.status === "Accepted" 
      ? "shadow-[inset_0_0_150px_rgba(16,185,129,0.1)]" // Emerald flash
      : "shadow-[inset_0_0_150px_rgba(244,63,94,0.1)]";  // Rose flash
  };

  // 1. Initial System Bootup Loader
  if (isCheckingAuth && !authUser)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#050505] text-primary">
        <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse" />
            <Loader2 className="size-14 animate-spin relative z-10" />
        </div>
        <div className="mt-6 flex flex-col items-center gap-1">
            <p className="text-[10px] font-black tracking-[0.4em] uppercase opacity-40">Initializing_Lab_OS</p>
            <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-1/2 animate-[loading_2s_ease-in-out_infinite]" />
            </div>
        </div>
      </div>
    );

  return (
    <div className={`h-screen w-full bg-[#050505] transition-all duration-1000 overflow-hidden ${getAmbientGlow()}`}>
      <Toaster 
        position="top-right"
        toastOptions={{
            duration: 4000,
            style: {
                background: '#121212',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '12px 24px',
                fontSize: '12px',
                fontWeight: '900',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                borderRadius: '16px',
            },
        }}
      />
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Unauthenticated routes: Pure Viewports */}
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />

          {/* Authenticated routes: Wrapped in Fixed Layout */}
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

      {/* Global CSS for the custom loader bar and scrollbars */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(116, 128, 255, 0.5);
        }
      `}} />
    </div>
  );
};

export default App;