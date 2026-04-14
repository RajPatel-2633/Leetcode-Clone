import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2, ShieldAlert } from 'lucide-react'; 
import { useAuthStore } from "../store/useAuthStore.js";
import { motion } from "framer-motion";

const AdminRoute = () => {
    const { authUser, isCheckingAuth } = useAuthStore();

    if (isCheckingAuth) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-[#050505] text-primary font-mono overflow-hidden">
                <div className="relative flex items-center justify-center">
                    {/* Industrial Glow Core */}
                    <div className="absolute size-32 rounded-full bg-primary/10 blur-[60px] animate-pulse" />
                    
                    {/* Thicker, more authoritative spin */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="relative z-10"
                    >
                        <Loader2 className="size-16 stroke-[3px]" />
                    </motion.div>

                    <div className="absolute -inset-8 border border-white/5 rounded-full animate-[ping_3s_linear_infinite] opacity-20" />
                </div>

                <div className="mt-12 text-center space-y-2">
                    <h2 className="text-xl font-black font-display tracking-tight uppercase text-white">
                        Access_Gate_Locked
                    </h2>
                    <p className="text-[10px] font-black tracking-[0.5em] uppercase text-primary/40 animate-pulse">
                        Verifying_Root_Credentials...
                    </p>
                </div>

                {/* Decorative side data */}
                <div className="absolute bottom-10 left-10 opacity-10">
                    <p className="text-[11px] font-black uppercase tracking-[1em] [writing-mode:vertical-lr]">
                        LEVEL_07_ENCRYPTION_ACTIVE
                    </p>
                </div>
            </div>
        );
    }

    // Role-based gatekeeping
    if (!authUser || authUser.role !== "ADMIN") {
        return <Navigate to="/" replace />
    }

    return <Outlet />;
}

export default AdminRoute;