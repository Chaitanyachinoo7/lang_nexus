import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Node, Edge, Trace } from './types';
import { INITIAL_NODES, INITIAL_EDGES } from './constants';
import { FlowCanvas } from './components/FlowCanvas';
import { LangSmithDashboard } from './components/LangSmithDashboard';
import { LangGraphViewer } from './components/LangGraphViewer';
import { simulateTrace } from './lib/langchain-utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { TooltipProvider } from './components/ui/tooltip';
import { 
  Network, 
  Workflow, 
  Search, 
  Layers, 
  Settings, 
  Cpu, 
  Cloud, 
  Github,
  ChevronRight,
  Info
} from 'lucide-react';

import { TemplateLibrary } from './components/TemplateLibrary';
import { Documentation } from './components/Documentation';
import { Template } from './templates';

export default function App() {
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<Edge[]>(INITIAL_EDGES);
  const [traces, setTraces] = useState<Trace[]>([]);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  const handleNodeClick = (id: string) => {
    setActiveNodeId(id);
  };

  const handleRunNode = (id: string) => {
    const node = nodes.find(n => n.id === id);
    if (!node) return;

    setActiveNodeId(id);
    const newTrace = simulateTrace(id, node.config);
    setTraces(prev => [...prev, newTrace]);
  };

  const handleSelectTemplate = (template: Template) => {
    setNodes(template.nodes);
    setEdges(template.edges);
    setActiveNodeId(null);
    setTraces([]);
  };

  const activeNode = nodes.find(n => n.id === activeNodeId);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#020203] text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
        {/* Navigation / Header */}
        <header className="sticky top-0 z-50 w-full border-b border-[#1a1a20] bg-[#0a0a0c]/80 backdrop-blur-xl">
          <div className="flex h-16 items-center px-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00f2ff] to-[#bd00ff] flex items-center justify-center shadow-cyan-500/20 shadow-xl">
                <Workflow className="w-5 h-5 text-black" />
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold tracking-tighter text-white">LANG.Ecosystem</h1>
                <div className="h-4 w-[1px] bg-[#333]" />
                <span className="font-mono text-[11px] text-[#666670] font-bold">v4.0.12-PROD</span>
              </div>
            </div>

            <nav className="ml-12 flex items-center gap-8">
              {[
                { name: 'LangChain', color: 'text-[#00f2ff]' },
                { name: 'LangGraph', color: 'text-[#bd00ff]' },
                { name: 'LangFlow', color: 'text-[#00ffaa]' },
                { name: 'LangSmith', color: 'text-[#ffbb00]' }
              ].map((item) => (
                <a 
                  key={item.name} 
                  href="#" 
                  className={`text-sm font-semibold transition-all hover:opacity-100 opacity-60 ${item.name === 'LangFlow' ? 'opacity-100 font-bold' : ''}`}
                >
                  <span className={item.color}>●</span> {item.name}
                </a>
              ))}
              <div className="h-4 w-[1px] bg-[#333]" />
              <Documentation />
            </nav>

            <div className="ml-auto flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00ffaa] shadow-[0_0_10px_#00ffaa] animate-pulse" />
                <span className="text-[12px] font-bold text-[#00ffaa] tracking-tight">LIVE ORCHESTRATION</span>
              </div>
              <div className="h-5 w-[1px] bg-[#333]" />
              <div className="text-[12px] font-mono opacity-50">Session: <span className="text-white">x88-f291</span></div>
              <Button variant="ghost" size="icon" className="text-[#666670] hover:text-white">
                <Github className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>        <main className="p-8 grid grid-cols-12 gap-8 max-w-[1800px] mx-auto">
          {/* Sidebar / Tools */}
          <motion.aside 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="col-span-12 lg:col-span-3 flex flex-col gap-6"
          >
             <div className="text-[11px] font-bold text-[#666670] tracking-[0.2em] mb-2 uppercase">Components</div>
             <div className="space-y-3">
                <TemplateLibrary onSelectTemplate={handleSelectTemplate} />
                <Button 
                   variant="ghost" 
                   onClick={() => { setNodes([]); setEdges([]); setActiveNodeId(null); setTraces([]); }}
                   className="w-full text-[#666670] hover:text-white border border-transparent hover:border-white/10 text-[9px] font-bold tracking-widest h-10"
                >
                  RESET ORCHESTRATOR
                </Button>
                
                <div className="pt-2">
                  {[
                  { name: 'LangChain', desc: 'Core Logic & LLM RAG', color: '#00f2ff' },
                  { name: 'LangGraph', desc: 'Stateful Orchestration', color: '#bd00ff' },
                  { name: 'LangFlow', desc: 'Visual Prototyping', color: '#00ffaa', active: true },
                  { name: 'LangSmith', desc: 'Tracing & Evaluation', color: '#ffbb00' }
                ].map((item, idx) => (
                  <motion.div 
                    key={item.name} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: item.active ? 1 : 0.6, y: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer group ${item.active ? 'bg-white/5 border-white/10 shadow-lg' : 'bg-transparent border-transparent opacity-60 hover:opacity-100 hover:border-white/5'}`}
                  >
                    <div className="text-sm font-bold mb-1" style={{ color: item.color }}>{item.name}</div>
                    <div className="text-[11px] text-[#666670] font-medium">{item.desc}</div>
                  </motion.div>
                ))}
                </div>
             </div>

             <LangSmithDashboard traces={traces} />
          </motion.aside>

          {/* Main Visualizer Area */}
          <section className="col-span-12 lg:col-span-9 flex flex-col gap-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative immersive-bg aspect-[16/8] w-full min-h-[550px] rounded-2xl border border-[#1a1a20] shadow-2xl overflow-hidden"
            >
              {/* Glow spots from UI design */}
              <div className="glow-spot w-[400px] h-[400px] top-[10%] left-[20%] bg-[#00f2ff]" />
              <div className="glow-spot w-[300px] h-[300px] bottom-[10%] right-[10%] bg-[#bd00ff]" />
              
              <FlowCanvas 
                nodes={nodes} 
                edges={edges} 
                traces={traces}
                activeNodeId={activeNodeId}
                onNodeClick={handleNodeClick}
                onRunNode={handleRunNode}
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <LangGraphViewer />
              <Card className="bg-[#0a0a0c] border-[#1a1a20]">
                <CardHeader className="py-4 px-6 border-b border-[#1a1a20]">
                   <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[#00f2ff]" />
                    <CardTitle className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#666670]">Node Configuration</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="py-6 min-h-[200px]">
                  <AnimatePresence mode="wait">
                    {activeNodeId ? (
                      <motion.div 
                        key={activeNodeId}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-white text-lg tracking-tight">{activeNode?.label}</h3>
                          <Badge className="bg-[#00f2ff]/10 text-[#00f2ff] border-[#00f2ff]/20 font-mono text-[9px] uppercase tracking-widest">{activeNode?.type}</Badge>
                        </div>
                        <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-[11px] font-mono text-[#666670] leading-relaxed">
                          <pre className="whitespace-pre-wrap text-[10px]">{JSON.stringify(activeNode?.config, null, 2)}</pre>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button className="w-full bg-[#00f2ff] text-black hover:bg-cyan-400 font-bold tracking-widest text-[10px] h-11" onClick={() => handleRunNode(activeNodeId)}>INVOKE NODE</Button>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-[#666670] text-sm font-medium">
                        <Layers className="w-10 h-10 mb-4 opacity-20" />
                        Select a node to modulate parameters
                      </div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>

            {/* Metrics Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-px bg-[#1a1a20] rounded-xl border border-[#1a1a20] overflow-hidden"
            >
     {[
                 { label: 'Active Tokens', val: '1.2M', sub: '↑ 4%', subColor: 'text-emerald-400' },
                 { label: 'State Variables', val: '842', sub: '', subColor: '' },
                 { label: 'Flow Redundancy', val: '0.02%', sub: '', subColor: '' },
                 { label: 'LangSmith Score', val: '94.2', sub: '', subColor: 'text-[#ffbb00]' }
               ].map((m) => (
                 <div key={m.label} className="bg-[#0a0a0c] p-6 flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-[#666670] uppercase tracking-wider mb-2">{m.label}</span>
                    <div className="text-3xl font-light font-mono tracking-tight text-white">
                      {m.val} {m.sub && <span className={`text-xs ml-1 font-bold ${m.subColor}`}>{m.sub}</span>}
                    </div>
                 </div>
               ))}
            </motion.div>
          </section>
        </main>

        {/* Cinematic Footer */}
        <footer className="mt-12 py-10 border-t border-[#1a1a20] bg-[#020203]">
          <div className="max-w-[1800px] mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex items-center gap-12">
               <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-[#666670] uppercase tracking-widest mb-1">Compute Provider</span>
                 <span className="text-xs font-bold text-white tracking-tight">V3-CLOUD-ORCHESTRATOR</span>
               </div>
               <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-[#666670] uppercase tracking-widest mb-1">Architecture</span>
                 <span className="text-xs font-bold text-white tracking-tight italic">Distributed LangGraph Runtime</span>
               </div>
             </div>
             <div className="text-[10px] font-mono text-[#666670]">
               [SYSTEM_STABLE] [LATENCY: 42MS] [UPTIME: 99.98%]
             </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}
