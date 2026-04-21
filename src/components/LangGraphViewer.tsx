import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Network, Play, RefreshCw, GitBranch } from 'lucide-react';

export const LangGraphViewer = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    { name: 'START', x: 50, y: 150 },
    { name: 'Agent', x: 200, y: 150 },
    { name: 'Condition', x: 350, y: 150 },
    { name: 'Tool', x: 350, y: 50 },
    { name: 'Human', x: 350, y: 250 },
    { name: 'END', x: 550, y: 150 },
  ];

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      setActiveStep(0);
    }
  };

  return (
    <Card className="bg-[#0a0a0c] border-[#1a1a20]">
      <CardHeader className="py-4 px-6 border-b border-[#1a1a20] flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-[#bd00ff]" />
          <CardTitle className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#666670]">LangGraph Runtime</CardTitle>
        </div>
        <div className="flex gap-2">
          <Button size="icon" variant="ghost" className="h-8 w-8 text-[#666670] hover:text-white" onClick={() => setActiveStep(0)}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button size="sm" className="h-8 bg-[#bd00ff] text-white hover:bg-purple-600 font-bold text-[10px]" onClick={handleNext}>
            <Play className="h-3 w-3 mr-2 fill-current" /> STEP
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-[300px] relative tech-grid rounded-b-xl overflow-hidden bg-black/40">
        <svg className="absolute inset-0 w-full h-full">
           <defs>
             <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
               <feGaussianBlur stdDeviation="5" result="blur" />
               <feComposite in="SourceGraphic" in2="blur" operator="over" />
             </filter>
           </defs>
           {/* Draw Base Path */}
           <path 
             d={`M ${steps[0].x} ${steps[0].y} L ${steps[1].x} ${steps[1].y} L ${steps[2].x} ${steps[2].y}`}
             stroke="rgba(189, 0, 255, 0.05)" strokeWidth="2" fill="none"
           />
           <path d={`M ${steps[2].x} ${steps[2].y} L ${steps[3].x} ${steps[3].y}`} stroke="rgba(189, 0, 255, 0.05)" strokeWidth="2" fill="none" />
           <path d={`M ${steps[2].x} ${steps[2].y} L ${steps[4].x} ${steps[4].y}`} stroke="rgba(189, 0, 255, 0.05)" strokeWidth="2" fill="none" />
           <path d={`M ${steps[2].x} ${steps[2].y} L ${steps[5].x} ${steps[5].y}`} stroke="rgba(189, 0, 255, 0.05)" strokeWidth="2" fill="none" />
           
           {/* Active Step Path Highlight */}
           <AnimatePresence>
             {activeStep > 0 && (
               <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  d={`M ${steps[activeStep - 1].x} ${steps[activeStep - 1].y} L ${steps[activeStep].x} ${steps[activeStep].y}`}
                  stroke="rgba(189, 0, 255, 0.6)"
                  strokeWidth="2"
                  filter="url(#nodeGlow)"
                  fill="none"
               />
             )}
           </AnimatePresence>
        </svg>

        {steps.map((step, idx) => (
          <motion.div
            key={step.name}
            className={`absolute px-4 py-1.5 rounded-lg border transition-all duration-500 flex items-center gap-2 backdrop-blur-md ${
              activeStep === idx 
                ? 'bg-[#bd00ff]/20 border-[#bd00ff] text-white scale-110 z-10 shadow-[0_0_20px_rgba(189,0,255,0.3)]' 
                : idx < activeStep 
                  ? 'bg-[#bd00ff]/5 border-[#bd00ff]/20 text-white/50 scale-100 z-0'
                  : 'bg-white/5 border-white/10 text-[#666670] scale-100 z-0'
            }`}
            style={{ left: step.x, top: step.y, transform: 'translate(-50%, -50%)' }}
            initial={false}
            animate={{ 
              scale: activeStep === idx ? 1.1 : 1,
              opacity: idx > activeStep ? 0.3 : 1
            }}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${activeStep === idx ? 'bg-[#bd00ff] animate-pulse' : idx < activeStep ? 'bg-[#bd00ff]/40' : 'bg-white/20'}`} />
            <span className="text-[9px] font-bold uppercase tracking-widest leading-none">{step.name}</span>
          </motion.div>
        ))}

        <AnimatePresence>
          {activeStep > 0 && (
            <motion.div
              layoutId="cursor"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute pointer-events-none"
              style={{ 
                left: steps[activeStep].x, 
                top: steps[activeStep].y, 
                transform: 'translate(-50%, -50%)' 
              }}
            >
              <div className="w-16 h-16 rounded-full bg-[#bd00ff]/10 border border-[#bd00ff]/20 animate-ping" />
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
