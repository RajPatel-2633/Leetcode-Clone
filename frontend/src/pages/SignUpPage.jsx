import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Code,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const SignUpSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(3, "Name must be at least 3 characters"),
});

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { signup, isSigninUp, authUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignUpSchema),
  });

  useEffect(() => {
    if (authUser) {
      navigate("/");
    }
  }, [authUser, navigate]);

  const onSubmit = async (data) => {
    try {
      await signup(data);
      console.log("SignUp Data:", data);
    } catch (error) {
      console.error("SignUp failed:", error);
    } 
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#0a0a0a] text-white">
      {/* Left Side - Form */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="flex flex-col justify-center items-center p-8 sm:p-16"
      >
        <div className="w-full max-w-md space-y-10">
          {/* Brand Header */}
          <div>
            <div className="flex items-center gap-2 text-primary font-black text-[10px] tracking-[0.3em] uppercase mb-2">
              <Code size={14} />
              <span>Protocol_Initialization</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2 uppercase italic">
              Create Your Lab.
            </h1>
            <p className="text-slate-500 font-medium">The first step to mastery.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  {...register("name")}
                  className={`w-full bg-white/5 border-2 border-white/5 rounded-xl py-4 pl-12 pr-4 focus:border-primary/50 focus:bg-white/10 outline-none transition-all duration-300 ${
                    errors.name ? "border-red-500/50" : ""
                  }`}
                  placeholder="ex. algo_runner"
                />
              </div>
              {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  {...register("email")}
                  className={`w-full bg-white/5 border-2 border-white/5 rounded-xl py-4 pl-12 pr-4 focus:border-primary/50 focus:bg-white/10 outline-none transition-all duration-300 ${
                    errors.email ? "border-red-500/50" : ""
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`w-full bg-white/5 border-2 border-white/5 rounded-xl py-4 pl-12 pr-12 focus:border-primary/50 focus:bg-white/10 outline-none transition-all duration-300 ${
                    errors.password ? "border-red-500/50" : ""
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/80 hover:to-blue-600/80 text-white font-black py-4 rounded-xl shadow-[0_0_20px_rgba(var(--p),0.3)] hover:shadow-primary/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              disabled={isSigninUp}
            >
              {isSigninUp ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  INJECTING DATA...
                </>
              ) : (
                "JOIN THE LAB."
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-slate-500 font-medium">
            Already registered?{" "}
            <Link to="/login" className="text-primary hover:underline font-bold">
              Log in.
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Right Side - Animated Hero */}
      <AuthImagePattern
        title={"Solve The Code."}
        subtitle={"Become part of the intelligence. Join LeetLabs."}
      />
    </div>
  );
};

export default SignUpPage;