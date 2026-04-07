import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ArrowRight
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const loginSchema = z.object({
  email: z.string().email("Invalid credential format"),
  password: z.string().min(6, "Token security breach: 6 chars min"),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
    } catch (error) {
      console.error("Login failed:", error);
    } 
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col font-primary overflow-hidden">
      
      {/* 1. TOP HEADER: Spans 100% Width */}
      <AuthImagePattern 
        isHeaderOnly={true}
        title="Welcome Back" 
        subtitle="Establish secure encrypted link to the central mainframe. System status: Online."
      />

      {/* 2. MAIN CONTENT: 50/50 Split Grid */}
      <div className="flex-1 grid lg:grid-cols-2">
        
        {/* LEFT COLUMN: FORM SIDE */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-center p-8 md:p-16 border-r border-white/5"
        >
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-1">
               <h3 className="text-3xl font-black uppercase font-display tracking-tight text-white leading-none">
                  Login_Credentials
               </h3>
               <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.4em]">
                  Awaiting_Identity_Verification...
               </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-slate-500 ml-2">Email_Identifier</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    {...register("email")}
                    className={`w-full bg-white/[0.03] border-2 border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:border-primary/50 focus:bg-white/10 outline-none transition-all font-mono text-sm ${
                      errors.email ? "border-red-500/50" : ""
                    }`}
                    placeholder="USER@LEETLABS.IO"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2 uppercase">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-slate-500 ml-2">Secure_Token</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className={`w-full bg-white/[0.03] border-2 border-white/5 rounded-2xl py-4 pl-12 pr-12 focus:border-primary/50 focus:bg-white/10 outline-none transition-all font-mono text-sm ${
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
                {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2 uppercase">{errors.password.message}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-primary hover:bg-primary/90 text-black font-black py-5 rounded-2xl shadow-[0_0_30px_rgba(var(--p),0.3)] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                {isLoggingIn ? (
                  <Loader2 className="size-6 animate-spin" />
                ) : (
                  <>
                    <span className="font-display uppercase tracking-tighter text-xl">Establish_Link</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-4 border-t border-white/5">
              <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">
                New identity required?{" "}
                <Link to="/signup" className="text-primary hover:text-white font-black transition-colors ml-1">
                  Initialize_Signup
                </Link>
              </p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: ANIMATION SIDE */}
        <div className="hidden lg:block">
           <AuthImagePattern />
        </div>

      </div>
    </div>
  );
};

export default LoginPage;