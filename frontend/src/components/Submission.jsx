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
      label: "Status", 
      value: submission.status, 
      icon: Activity, 
      color: submission.status === 'Accepted' ? "text-emerald-400" : "text-rose-400" 
    },
    { 
      label: "Success Rate", 
      value: `${successRate.toFixed(1)}%`, 
      icon: CheckCircle2, 
      color: "text-primary" 
    },
    { 
      label: "Avg Runtime", 
      value: `${avgTime.toFixed(3)} s`, 
      icon: Clock, 
      color: "text-blue-400" 
    },
    { 
      label: "Avg Memory", 
      value: `${avgMemory.toFixed(0)} KB`, 
      icon: Memory, 
      color: "text-purple-400" 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* 1. Telemetry Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <metric.icon size={14} className="text-slate-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{metric.label}</span>
            </div>
            <div className={`text-xl font-black italic uppercase tracking-tighter ${metric.color}`}>
              {metric.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 2. Detailed Diagnostics Table */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-black/40 px-6 py-4 border-b border-white/5 flex items-center justify-between">
           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
             <Terminal size={14} className="text-primary"/> 
             Diagnostics_Log
           </h3>
           <span className="text-[10px] font-bold text-slate-600 uppercase">Node_{submission.id || 'Current'}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.01] border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Expected_Return</th>
                <th className="px-6 py-4">Actual_Stdout</th>
                <th className="px-6 py-4">Memory</th>
                <th className="px-6 py-4 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {submission.testCases.map((testCase, idx) => (
                <tr key={testCase.id || idx} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold">
                    {testCase.passed ? (
                      <div className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 size={16} />
                        <span className="text-[10px] uppercase tracking-widest">Passed</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-rose-400">
                        <XCircle size={16} />
                        <span className="text-[10px] uppercase tracking-widest">Failed</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <code className="bg-black/40 px-3 py-1 rounded-lg text-xs text-blue-300 border border-white/5 group-hover:border-blue-500/30 transition-colors">
                      {testCase.expected}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <code className={`bg-black/40 px-3 py-1 rounded-lg text-xs border border-white/5 transition-colors ${testCase.passed ? 'text-emerald-300 group-hover:border-emerald-500/30' : 'text-rose-300 group-hover:border-rose-500/30'}`}>
                      {testCase.stdout || 'null'}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-400">
                    {testCase.memory}
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-400 text-right">
                    {testCase.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubmissionResults;