import React from 'react';
import { Trace } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Activity, Clock, Layers, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface LangSmithDashboardProps {
  traces: Trace[];
}

export const LangSmithDashboard: React.FC<LangSmithDashboardProps> = ({ traces }) => {
  return (
    <Card className="h-full bg-[#0a0a0c] border-[#1a1a20]">
      <CardHeader className="py-4 px-6 border-b border-[#1a1a20] flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#ffbb00]" />
          <CardTitle className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#666670]">LangSmith Traces</CardTitle>
        </div>
        <Badge variant="outline" className="font-mono text-[9px] border-[#ffbb00]/20 text-[#ffbb00] bg-[#ffbb00]/5">
          {traces.length} RUNS
        </Badge>
      </CardHeader>
      <CardContent className="p-0 bg-black/20">
        <ScrollArea className="h-[calc(100vh-22rem)] px-6">
          <div className="space-y-3 py-6">
            {traces.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-[#666670]">
                <Layers className="w-12 h-12 opacity-10 mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest opacity-50">Null Traces</p>
                <p className="text-[10px] opacity-30 mt-1 italic">Awaiting orchestration events...</p>
              </div>
            ) : (
              traces.slice().reverse().map((trace, idx) => (
                <motion.div
                  key={trace.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative bg-[#111115] border border-white/5 rounded-lg p-3 hover:border-[#ffbb00]/30 hover:bg-[#1a1a20] transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {trace.status === 'success' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00ffaa]" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                      )}
                      <span className="font-mono text-[10px] font-bold text-white tracking-tight">RUN_{trace.nodeId.toUpperCase()}</span>
                    </div>
                    <span className="text-[9px] font-mono text-[#666670]">{new Date(trace.timestamp).toLocaleTimeString()}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="text-[9px] bg-black/40 p-2 rounded border border-white/5 overflow-hidden">
                      <div className="font-bold text-[#666670] uppercase text-[8px] tracking-widest mb-1">In</div>
                      <div className="truncate text-white/50 font-mono">{JSON.stringify(trace.input)}</div>
                    </div>
                    <div className="text-[9px] bg-black/40 p-2 rounded border border-white/5 overflow-hidden">
                      <div className="font-bold text-[#ffbb00] uppercase text-[8px] tracking-widest mb-1">Out</div>
                      <div className="truncate text-[#ffbb00] font-mono">{JSON.stringify(trace.output)}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[9px] text-[#666670] font-mono">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-[#ffbb00]" />
                        {trace.duration}ms
                      </div>
                      <Badge className="text-[8px] h-4 py-0 bg-[#ffbb00]/10 text-[#ffbb00] border-none" variant="secondary">
                        {trace.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffbb00] shadow-[0_0_8px_#ffbb00] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
