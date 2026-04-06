import { motion } from "framer-motion";
import { Code, Terminal, FileCode, Braces, Cpu } from "lucide-react";

const AuthImagePattern = ({ title, subtitle }) => {
  // Floating icons for the background "nebula"
  const bgIcons = [
    { Icon: Braces, top: "10%", left: "15%", delay: 0 },
    { Icon: FileCode, top: "25%", left: "80%", delay: 0.5 },
    { Icon: Terminal, top: "70%", left: "15%", delay: 1 },
    { Icon: Code, top: "60%", left: "75%", delay: 1.5 },
    { Icon: Cpu, top: "85%", left: "45%", delay: 2 },
  ];

  return (
    <div className="hidden lg:flex flex-col items-center justify-center bg-[#050505] p-12 relative overflow-hidden">
      {/* 1. Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]" />

      {/* 2. Floating Background Icons */}
      {bgIcons.map((item, i) => (
        <motion.div
          key={i}
          className="absolute text-white/5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: [0.05, 0.15, 0.05], 
            y: [0, -20, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 5, repeat: Infinity, delay: item.delay }}
          style={{ top: item.top, left: item.left }}
        >
          <item.Icon size={60} strokeWidth={1} />
        </motion.div>
      ))}

      <div className="z-10 max-w-md w-full flex flex-col items-center">
        {/* 3. The Rotating Geometric Core */}
        <div className="relative w-72 h-72 mb-16 group">
          {/* Outer Pulsing Glow */}
          <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          
          {/* Outer Rotating Dotted Ring */}
          <motion.div
            className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
          
          {/* The 3D Wireframe Hexagon (Icosahedron) */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            animate={{ 
              rotateY: [0, 360],
              rotateX: [0, 180, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <svg viewBox="0 0 100 100" className="w-56 h-56 drop-shadow-[0_0_20px_rgba(var(--p),0.5)]">
              <motion.path
                d="M50 5 L95 25 L95 75 L50 95 L5 75 L5 25 Z M50 5 L50 95 M5 25 L95 25 M5 75 L95 75 M5 25 L50 50 L95 25 M5 75 L50 50 L95 75"
                fill="none"
                stroke="currentColor"
                className="text-primary"
                strokeWidth="0.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              />
            </svg>
          </motion.div>

          {/* Floating 'Orbiting' Code Bits */}
          <motion.div 
             animate={{ rotate: -360 }}
             transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
             className="absolute inset-0"
          >
             <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#121212] border border-white/10 px-3 py-1 rounded-full text-[10px] font-mono text-primary shadow-xl">
               function solve()
             </div>
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-[#121212] border border-white/10 px-3 py-1 rounded-full text-[10px] font-mono text-blue-400 shadow-xl">
               O(log n)
             </div>
          </motion.div>
        </div>

        {/* 4. High-Impact Typography */}
        <div className="text-center space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black tracking-tighter text-white uppercase italic leading-none"
          >
            {title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-400 text-lg font-light tracking-wide max-w-sm mx-auto"
          >
            {subtitle}
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default AuthImagePattern;