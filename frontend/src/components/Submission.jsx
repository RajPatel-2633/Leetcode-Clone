import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, MemoryStick as Memory, Activity, Terminal } from 'lucide-react';

const SubmissionResults = ({ submission }) => {
  // Parse stringified arrays
  const memoryArr = JSON.parse(submission.memory || '[]');
  const timeArr = JSON.parse(submission.time || '[]');

  // Calculate averages
  const avgMemory = memoryArr.length > 0 
    ? memoryArr.map(m => parseFloat(m)).reduce((a, b) => a + b, 0) / memoryArr.length 
    : 0;

  const avgTime = timeArr.length > 0 
    ? timeArr.map(t => parseFloat(t)).reduce((a, b) => a + b, 0) / timeArr.length 
    : 0;

  const passedTests = submission.testCases.filter(tc => tc.passed).length;
  const totalTests = submission.testCases.length;
  const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  const metrics = [
    { 
      label: "System_Status", 
      value: submission.status.toUpperCase().replace(' ', '_'), 
      icon: Activity, 
      color: submission.status === 'Accepted' ? "text-emerald-400" : "text-rose-500" 
    },
    { 
      label: "Success_Rate", 
      value: `${successRate.toFixed(1)}%`, 
      icon: CheckCircle2, 
      color: "text-primary" 
    },
    { 
      label: "Avg_Latency", 
      value: `${avgTime.toFixed(3)}s`, 
      icon: Clock, 
      color: "text-blue-400" 
    },
    { 
      label: "Memory_Load", 
      value: `${avgMemory.toFixed(0)}KB`, 
      icon: Memory, 
      color: "text-purple-400" 
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
      
      {/* 1. Telemetry Stats Grid: Bold & Straight */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/[0.03] border-2 border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <metric.icon size={16} strokeWidth={2.5} className="text-slate-600" />
              <span className="text-[9px] font-mono font-black uppercase tracking-[0.3em] text-slate-500">{metric.label}</span>
            </div>
            <div className={`text-2xl font-black font-display tracking-tight leading-none ${metric.color}`}>
              {metric.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 2. Detailed Diagnostics Table */}
      <div className="bg-white/[0.02] border-2 border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="bg-black/60 px-8 py-6 border-b-2 border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <Terminal size={18} strokeWidth={3} className="text-primary"/> 
              <h3 className="text-sm font-black uppercase tracking-[0.4em] font-display text-white">
                Diagnostics_Log
              </h3>
           </div>
           <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-md">
             <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">
               ID_BUFFER: {submission.id?.slice(-8).toUpperCase() || 'LIVE_FEED'}
             </span>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.01] border-b-2 border-white/5 text-[10px] font-mono font-black uppercase tracking-[0.4em] text-slate-600">
                <th className="px-8 py-5">Verification</th>
                <th className="px-8 py-5">Expectation</th>
                <th className="px-8 py-5">Stdout_Return</th>
                <th className="px-8 py-5">Memory</th>
                <th className="px-8 py-5 text-right">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-white/5">
              {submission.testCases.map((testCase, idx) => (
                <tr key={testCase.id || idx} className="hover:bg-white/[0.03] transition-colors group/row">
                  <td className="px-8 py-6">
                    {testCase.passed ? (
                      <div className="flex items-center gap-3 text-emerald-400">
                        <CheckCircle2 size={18} strokeWidth={3} />
                        <span className="text-[11px] font-mono font-black uppercase tracking-widest">Passed</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-rose-500">
                        <XCircle size={18} strokeWidth={3} />
                        <span className="text-[11px] font-mono font-black uppercase tracking-widest">Failed</span>
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <code className="bg-[#080808] px-4 py-2 rounded-xl text-xs font-mono font-bold text-blue-300 border-2 border-white/5 group-hover/row:border-blue-500/30 transition-all">
                      {testCase.expected}
                    </code>
                  </td>
                  <td className="px-8 py-6">
                    <code className={`bg-[#080808] px-4 py-2 rounded-xl text-xs font-mono font-bold border-2 border-white/5 transition-all ${testCase.passed ? 'text-emerald-400 group-hover/row:border-emerald-500/30' : 'text-rose-400 group-hover/row:border-rose-500/30'}`}>
                      {testCase.stdout || 'NULL_PTR'}
                    </code>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-mono font-black text-slate-500 tracking-wider">
                      {testCase.memory || '0_KB'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="text-xs font-mono font-black text-slate-500 tracking-wider">
                      {testCase.time || '0.000_S'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Hardware Mark */}
        <div className="bg-black/40 px-8 py-4 border-t-2 border-white/5 text-right">
           <span className="text-[8px] font-mono font-black text-slate-800 uppercase tracking-[1em]">
              End_Of_Transmission_Node_Active
           </span>
        </div>
      </div>
    </div>
  );
};

export default SubmissionResults;