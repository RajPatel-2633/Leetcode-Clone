import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react'; // Swapped to Loader2 for a cleaner spin
import { useAuthStore } from "../store/useAuthStore.js";

const AdminRoute = () => {
    const { authUser, isCheckingAuth } = useAuthStore();

    if (isCheckingAuth) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-[#050505] text-primary">
                <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
                    <Loader2 className="size-12 animate-spin relative z-10" />
                </div>
                <p className="mt-4 text-[10px] font-black tracking-[0.3em] uppercase opacity-50">
                    Verifying_Root_Credentials...
                </p>
            </div>
        );
    }

    if (!authUser || authUser.role !== "ADMIN") {
        return <Navigate to="/" replace />
    }

    return <Outlet />;
}

export default AdminRoute;