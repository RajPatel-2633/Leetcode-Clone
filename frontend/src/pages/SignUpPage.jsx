import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldPlus
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const SignUpSchema = z.object({
  email: z.string().email("Invalid credential format"),
  password: z.string().min(6, "Security breach: 6 chars min"),
  name: z.string().min(3, "ID too short: 3 chars min"),
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
    } catch (error) {
      console.error("SignUp failed:", error);
    } 
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col font-primary overflow-hidden">
      
      {/* 1. TOP HEADER: 100% Width Industrial Banner */}
      <AuthImagePattern 
        isHeaderOnly={true}
        title="Initialize Space" 
        subtitle="Register new operative identity. Begin your evolution within the LeetLabs mainframe."
      />

      {/* 2. MAIN CONTENT: 50/50 Split Grid */}
      <div className="flex-1 grid lg:grid-cols-2 overflow-hidden">
        
        {/* LEFT COLUMN: SIGNUP FORM */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-center p-8 md:p-16 border-r border-white/5"
        >
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-1">
               <h3 className="text-3xl font-black uppercase font-display tracking-tight text-white leading-none">
                  New_Operative
               </h3>
               <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.4em]">
                  Awaiting_Credential_Input...
               </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-slate-500 ml-2">Public_Identifier</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors" size={18} />
                  <input
                    type="text"
                    {...register("name")}
                    className={`w-full bg-white/[0.03] border-2 border-white/5 rounded-2xl py-4 pl-12 pr-6 focus:border-primary/50 outline-none transition-all font-mono text-sm ${
                      errors.name ? "border-red-500/50" : ""
                    }`}
                    placeholder="EX. ALGO_RUNNER"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2 uppercase">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-slate-500 ml-2">Email_Stream</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors" size={18} />
                  <input
                    type="email"
                    {...register("email")}
                    className={`w-full bg-white/[0.03] border-2 border-white/5 rounded-2xl py-4 pl-12 pr-6 focus:border-primary/50 outline-none transition-all font-mono text-sm ${
                      errors.email ? "border-red-500/50" : ""
                    }`}
                    placeholder="OPERATIVE@LEETLABS.IO"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2 uppercase">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-slate-500 ml-2">Security_Token</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className={`w-full bg-white/[0.03] border-2 border-white/5 rounded-2xl py-4 pl-12 pr-12 focus:border-primary/50 outline-none transition-all font-mono text-sm ${
                      errors.password ? "border-red-500/50" : ""
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-600 hover:text-white transition-colors"
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
                disabled={isSigninUp}
                className="w-full bg-primary hover:bg-primary/90 text-black font-black py-5 rounded-2xl shadow-[0_0_30px_rgba(var(--p),0.3)] transition-all flex items-center justify-center gap-3 active:scale-[0.98] mt-4"
              >
                {isSigninUp ? (
                  <Loader2 className="size-6 animate-spin" />
                ) : (
                  <>
                    <span className="font-display uppercase tracking-tighter text-xl">Inject_Identity</span>
                    <ShieldPlus size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-6 border-t border-white/5">
              <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">
                Identity already exists?{" "}
                <Link to="/login" className="text-primary hover:text-white font-black transition-colors ml-1 border-b border-primary/20">
                  Secure_Login
                </Link>
              </p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: HEX-CORE ANIMATION */}
        <div className="hidden lg:block">
           <AuthImagePattern />
        </div>

      </div>
    </div>
  );
};

export default SignUpPage;