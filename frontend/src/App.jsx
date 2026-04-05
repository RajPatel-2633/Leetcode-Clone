import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import ProblemPage from "./pages/ProblemPage";
import Layout from "./components/Layout";

import AddProblem from "./pages/AddProblem";
import Profile from "./pages/Profile";
import AdminRoute from "./components/AdminRoute";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-start">
      <Toaster />
      <Routes>
        {/* Unauthenticated routes - no Layout */}
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />

        {/* Authenticated routes - wrapped with Layout */}
        <Route path="/" element={authUser ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<HomePage />} />
          <Route path="problem/:id" element={<ProblemPage />} />
          <Route path="profile" element={<Profile />} />
          <Route element={<AdminRoute />}>
            <Route path="add-problem" element={<AddProblem />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

export default App;