import React from 'react';
import { motion } from 'motion/react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BookOpen, 
  Network, 
  Workflow, 
  Search, 
  Activity, 
  Zap, 
  GitBranch, 
  Layers, 
  Database,
  ShieldCheck,
  BrainCircuit,
  Terminal,
  LayoutGrid
} from 'lucide-react';

export const Documentation: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger render={
        <Button variant="ghost" className="flex items-center gap-2 text-[#666670] hover:text-white transition-colors group">
          <BookOpen className="w-4 h-4 group-hover:text-[#00f2ff]" />
          <span className="text-[11px] font-bold tracking-widest uppercase">Documentation</span>
        </Button>
      }/>
      <DialogContent className="max-w-5xl bg-[#0a0a0c] border-[#1a1a20] text-white p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <DialogHeader className="p-8 border-b border-[#1a1a20] bg-gradient-to-r from-[#0a0a0c] to-[#111115]">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#00f2ff]/10 flex items-center justify-center border border-[#00f2ff]/20">
              <BrainCircuit className="w-6 h-6 text-[#00f2ff]" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">EcoSystem Intelligence</DialogTitle>
              <DialogDescription className="text-[#666670] font-medium">
                Comprehensive guide to the LangChain, LangGraph, and LangSmith orchestration layers.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh]">
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* LangChain Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Workflow className="w-5 h-5 text-[#00f2ff]" />
                <h2 className="text-lg font-bold tracking-tight text-white">LangChain Core</h2>
              </div>
              <div className="space-y-4">
                <DocItem 
                  title="Chains" 
                  desc="The fundamental building blocks. Chains represent fixed sequences of actions, often wrapping an LLM call with prompt templates and output parsers."
                />
                <DocItem 
                  title="Retrieval (RAG)" 
                  desc="Grounding models in external data. Retrieval-Augmented Generation involves indexing documents into vector stores and querying them during the inference loop."
                />
                <DocItem 
                  title="Memory" 
                  desc="State management for conversations. LangChain provides utilities for full history persistence, summarization, and 'windowed' context."
                />
              </div>
            </section>

            {/* LangGraph Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <GitBranch className="w-5 h-5 text-[#bd00ff]" />
                <h2 className="text-lg font-bold tracking-tight text-white">LangGraph Runtime</h2>
              </div>
              <div className="space-y-4">
                <DocItem 
                  title="Cyclical Graphs" 
                  desc="Unlike traditional DAGs, LangGraph allows for nodes to loop back into one another, enabling true iterative reasoning and self-grading agents."
                />
                <DocItem 
                  title="State Management" 
                  desc="A global 'State' object is passed between nodes, allowing for complex branching logic and 'checkpoints' that persist even if the process is interrupted."
                />
                <DocItem 
                  title="Human-in-the-Loop" 
                  desc="Built-in breakpoints allow the graph to pause execution and wait for human approval or input before proceeding to sensitive steps."
                />
              </div>
            </section>

            {/* LangSmith Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-[#ffbb00]" />
                <h2 className="text-lg font-bold tracking-tight text-white">LangSmith Observability</h2>
              </div>
              <div className="space-y-4">
                <DocItem 
                  title="Tracing" 
                  desc="Full visibility into every LLM call, tool invocation, and retrieval step. Traces help debug latency issues and logic leaks in production."
                />
                <DocItem 
                  title="Evaluation" 
                  desc="Dataset-driven testing. Run agents against historical data and use AI-assisted evaluators to grade the quality of outputs."
                />
                <DocItem 
                  title="Feedback Loops" 
                  desc="Capture user interactions and 'thumbs up/down' events to fine-tune your prompts and retrieval strategies over time."
                />
              </div>
            </section>

            {/* Patterns: Routing, Correction, Reflection */}

            {/* LangFlow Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <LayoutGrid className="w-5 h-5 text-[#00f2ff]" />
                <h2 className="text-lg font-bold tracking-tight text-white">LangFlow (Visual IDE)</h2>
              </div>
              <div className="space-y-4">
                <DocItem 
                  title="Graphical Orchestration" 
                  desc="A high-level interface for assembling complex LLM pipelines without writing boilerplate code, using a node-based visual drag-and-drop paradigm."
                />
                <DocItem 
                  title="Rapid Prototyping" 
                  desc="Instantly iterate on prompt structures and tool connections, seeing the impact on outputs in real-time before exporting to production code."
                />
              </div>
            </section>

            {/* Advanced Multi-Agent Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Network className="w-5 h-5 text-[#bd00ff]" />
                <h2 className="text-lg font-bold tracking-tight text-white">Multi-Agent Architectures</h2>
              </div>
              <div className="space-y-4">
                <DocItem 
                  title="Supervisor Pattern" 
                  desc="A central 'Supervisor' agent interprets the user request and delegates tasks to specialized 'Worker' agents, coordinating their final results."
                />
                <DocItem 
                  title="Hierarchical Teams" 
                  desc="Organizing agents into nested structures where sub-teams handle domain-specific logic and report back to a high-level router."
                />
              </div>
            </section>

             {/* Deployment Section */}
             <section className="space-y-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#00ffaa]" />
                <h2 className="text-lg font-bold tracking-tight text-white">Production Integrity</h2>
              </div>
              <div className="space-y-4">
                <DocItem 
                  title="Rate Limiting & Safety" 
                  desc="Implementing defensive logic to handle LLM rate limits gracefully and ensuring safety filters are applied to both input and output."
                />
                <DocItem 
                  title="Cost Management" 
                  desc="Monitoring token usage and utilizing caching layers (like Redis) to avoid redundant LLM calls and reduce operational overhead."
                />
              </div>
            </section>
          </div>
        </ScrollArea>
        
        <div className="p-6 bg-black/40 border-t border-[#1a1a20] flex items-center justify-between">
           <div className="flex items-center gap-2 text-[10px] text-[#666670] font-mono">
             <ShieldCheck className="w-3 h-3" />
             <span>VERIFIED_CONCEPTS_V4.0</span>
           </div>
           <p className="text-[10px] text-[#666670] font-mono uppercase tracking-[0.2em]">Explore the blueprints in the Template Library to see these concepts in action</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DocItem = ({ title, desc }: { title: string, desc: string }) => (
  <motion.div 
    whileHover={{ x: 5 }}
    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
  >
    <h3 className="text-white font-bold text-sm mb-1 group-hover:text-[#00f2ff] transition-colors">{title}</h3>
    <p className="text-[12px] text-[#666670] leading-relaxed font-medium">{desc}</p>
  </motion.div>
);
