import { motion } from "framer-motion";
import { Activity } from "lucide-react";

const AuthImagePattern = ({ title, subtitle, isHeaderOnly = false }) => {
  // --- RENDER 1: REFINED COMPACT HEADER (100% Width) ---
  if (isHeaderOnly) {
    return (
      <div className="w-full p-6 md:px-12 border-b border-white/5 bg-black/60 backdrop-blur-xl shrink-0 z-50">
        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col md:flex-row items-center gap-6"
          >
            {/* straight, bold header */}
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white uppercase font-display leading-none">
              {title}<span className="text-primary">_</span>
            </h2>
            <div className="hidden md:flex items-center gap-3 border-l border-white/10 pl-6">
              <Activity size={14} className="text-primary animate-pulse" />
              <p className="text-[9px] font-mono font-black uppercase tracking-[0.4em] text-slate-500">
                Protocol: Secure_Auth_v4
              </p>
            </div>
          </motion.div>

          <motion.p 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 font-mono font-bold text-[9px] uppercase tracking-[0.2em] hidden lg:block"
          >
            {subtitle}
          </motion.p>
        </div>
      </div>
    );
  }

  // --- RENDER 2: HEXAGON WITH DENSER ORBITS (50% Side) ---
  
  // Define 6 distinct metadata tags and their unique rotations
  const orbitData = [
    { rotation: 0, text: "[ LINK_STABLE ]" },
    { rotation: 60, text: "[ NODE_ACTIVE ]" },
    { rotation: 120, text: "[ ENCRYPT_ON ]" },
    { rotation: 180, text: "[ PORT_82_OPEN ]" },
    { rotation: 240, text: "[ KERNEL_OK ]" },
    { rotation: 300, text: "[ DATA_STREAM ]" },
  ];

  return (
    <div className="relative flex items-center justify-center h-full w-full overflow-hidden border-l border-white/5 bg-black/20">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-[0.02]" 
        style={{ 
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, 
          backgroundSize: '50px 50px' 
        }} 
      />
      
      <div className="relative w-96 h-96 flex items-center justify-center scale-90 md:scale-100">
        
        {/* Core Wireframe Icosahedron */}
        <motion.div 
          animate={{ rotateY: 360, rotateX: [0, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: "preserve-3d" }}
          className="w-64 h-64 z-10"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_30px_rgba(var(--p),0.4)]">
            <motion.path
              d="M50 5 L95 25 L95 75 L50 95 L5 75 L5 25 Z M50 5 L50 95 M5 25 L95 25 M5 75 L95 75 M5 25 L50 50 L95 25 M5 75 L50 50 L95 75"
              fill="none"
              stroke="currentColor"
              className="text-primary"
              strokeWidth="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
            />
          </svg>
        </motion.div>

        {/* --- ADDED: 6 Orbiting Data Tags --- */}
        {orbitData.map((data, i) => (
          <motion.div 
            key={i}
            animate={{ rotate: data.rotation - 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            /* Increased inset to spread them out further */
            className="absolute inset-[-60px] pointer-events-none flex items-center justify-center"
          >
            <div 
              className="absolute top-0 px-2.5 py-1 bg-black/80 border border-white/10 rounded backdrop-blur-md shadow-xl"
              style={{ transform: `rotate(${-data.rotation + 360}deg)` }}
            >
              <span className="text-[7px] font-mono font-black text-primary uppercase tracking-widest whitespace-nowrap">
                {data.text}
              </span>
            </div>
          </motion.div>
        ))}

        {/* Central Pulse Aura */}
        <div className="absolute inset-20 bg-primary/5 rounded-full blur-[100px] animate-pulse" />
      </div>

      {/* Decorative Corner Label */}
      <div className="absolute bottom-8 right-8 font-mono font-black text-[8px] text-white/10 uppercase tracking-[1em] [writing-mode:vertical-lr]">
        STATIC_ANALYSIS_MODE
      </div>
    </div>
  );
};

export default AuthImagePattern;