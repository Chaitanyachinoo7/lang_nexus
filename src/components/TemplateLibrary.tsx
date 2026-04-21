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
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LayoutGrid, ArrowRight, Zap, Database, MessageSquare, BarChart3, FileText } from 'lucide-react';
import { TEMPLATES, Template } from '../templates';

interface TemplateLibraryProps {
  onSelectTemplate: (template: Template) => void;
}

const TEMPLATE_ICONS: Record<string, any> = {
  'rag-flow': Database,
  'agentic-chatbot': MessageSquare,
  'data-scientist-agent': BarChart3,
  'summary-pipeline': FileText,
};

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ onSelectTemplate }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          <Button 
            variant="outline" 
            className="w-full bg-[#0a0a0c] border-[#1a1a20] hover:bg-white/5 hover:border-white/10 text-white font-bold tracking-widest text-[10px] h-12 flex gap-2"
          >
            <LayoutGrid className="w-4 h-4 text-[#00f2ff]" />
            TEMPLATE LIBRARY
          </Button>
        }
      />
      <DialogContent className="max-w-4xl bg-[#0a0a0c] border-[#1a1a20] text-white p-0 overflow-hidden">
        <DialogHeader className="p-8 border-b border-[#1a1a20]">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-5 h-5 text-[#ffbb00]" />
            <DialogTitle className="text-xl font-bold tracking-tight">Ecosystem Templates</DialogTitle>
          </div>
          <DialogDescription className="text-[#666670] text-sm font-medium">
            Accelerate your development cycle by loading pre-configured LangChain and LangGraph orchestration flows.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="p-8 grid md:grid-cols-2 gap-6">
            {TEMPLATES.map((template, idx) => {
              const Icon = TEMPLATE_ICONS[template.id] || LayoutGrid;
              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative flex flex-col p-6 rounded-2xl bg-[#111115] border border-white/5 hover:border-[#00f2ff]/30 transition-all cursor-pointer overflow-hidden"
                  onClick={() => {
                    onSelectTemplate(template);
                    setOpen(false);
                  }}
                >
                  {/* Decorative glow */}
                  <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#00f2ff]/5 blur-3xl group-hover:bg-[#00f2ff]/20 transition-all" />
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#00f2ff]/10 group-hover:border-[#00f2ff]/20 transition-colors">
                      <Icon className="w-6 h-6 text-[#00f2ff]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white tracking-tight">{template.name}</h3>
                      <Badge className="mt-1 bg-white/5 text-[#666670] border-none text-[8px] tracking-[0.1em] font-mono">
                        {template.nodes.length} NODES | {template.edges.length} EDGES
                      </Badge>
                    </div>
                  </div>

                  <p className="text-xs text-[#666670] font-medium leading-relaxed mb-6 flex-grow">
                    {template.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[10px] font-bold text-[#00f2ff] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                      Load Template <ArrowRight className="w-3 h-3" />
                    </span>
                    <div className="flex -space-x-2">
                       {Array.from(new Set(template.nodes.map(n => n.type))).map((type, i) => (
                         <div 
                           key={i} 
                           className="w-6 h-6 rounded-full border-2 border-[#111115] bg-[#0a0a0c] flex items-center justify-center"
                           title={type}
                         >
                           <div className={`w-1.5 h-1.5 rounded-full ${
                             type === 'llm' ? 'bg-[#bd00ff]' : 
                             type === 'tool' ? 'bg-[#ffbb00]' : 
                             type === 'output' ? 'bg-[#00ffaa]' : 'bg-[#00f2ff]'
                           }`} />
                         </div>
                       ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
        <div className="p-4 bg-black/40 border-t border-[#1a1a20] text-center">
            <p className="text-[10px] text-[#666670] font-mono uppercase tracking-[0.2em]">Select an architectural blueprint to initialize the orchestrator</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
