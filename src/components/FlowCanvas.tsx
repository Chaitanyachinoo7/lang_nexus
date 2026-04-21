import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Node, Edge, Trace } from '../types';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Zap, Wrench, MessageSquare, Terminal, Activity, ArrowRight, Play } from 'lucide-react';

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  traces: Trace[];
  activeNodeId: string | null;
  onNodeClick: (id: string) => void;
  onRunNode: (id: string) => void;
}

const NODE_ICONS: Record<string, any> = {
  llm: Zap,
  tool: Wrench,
  prompt: MessageSquare,
  output: ArrowRight,
  router: Activity,
  memory: Terminal,
};

interface DataPacket {
  id: string;
  edgeId: string;
  color: string;
}

export const FlowCanvas: React.FC<FlowCanvasProps> = ({
  nodes,
  edges,
  traces,
  activeNodeId,
  onNodeClick,
  onRunNode
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePackets, setActivePackets] = useState<DataPacket[]>([]);

  // Effect to trigger data packets when a new trace is added
  useEffect(() => {
    if (traces.length === 0) return;
    const latestTrace = traces[traces.length - 1];
    
    // Find edges where this node is the source
    const outboundEdges = edges.filter(e => e.source === latestTrace.nodeId);
    
    // Determine color based on node type
    const sourceNode = nodes.find(n => n.id === latestTrace.nodeId);
    let packetColor = '#00f2ff';
    if (sourceNode?.type === 'llm') packetColor = '#bd00ff';
    if (sourceNode?.type === 'tool') packetColor = '#ffbb00';
    if (sourceNode?.type === 'output') packetColor = '#00ffaa';

    const newPackets = outboundEdges.map(e => ({
      id: Math.random().toString(36).substr(2, 9),
      edgeId: e.id,
      color: packetColor
    }));

    setActivePackets(prev => [...prev, ...newPackets]);

    // Cleanup packets after animation Duration
    const timer = setTimeout(() => {
      setActivePackets(prev => prev.filter(p => !newPackets.some(np => np.id === p.id)));
    }, 1000);

    return () => clearTimeout(timer);
  }, [traces, edges]);

  return (
    <div className="relative w-full h-full immersive-bg tech-grid overflow-hidden">
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.2)" />
          </marker>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <radialGradient id="packet-glow">
            <stop offset="0%" stopColor="white" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
        {edges.map((edge) => {
          const source = nodes.find((n) => n.id === edge.source);
          const target = nodes.find((n) => n.id === edge.target);
          if (!source || !target) return null;

          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const offset = 40; 
          
          const x1 = source.x + (dx * offset) / dist;
          const y1 = source.y + (dy * offset) / dist;
          const x2 = target.x - (dx * offset) / dist;
          const y2 = target.y - (dy * offset) / dist;

          const packets = activePackets.filter(p => p.edgeId === edge.id);

          return (
            <g key={edge.id}>
              <motion.path
                d={`M ${x1} ${y1} L ${x2} ${y2}`}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
                fill="none"
              />
              <motion.path
                d={`M ${x1} ${y1} L ${x2} ${y2}`}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                fill="none"
                markerEnd="url(#arrowhead)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
              />

              {/* Data Packet Animation */}
              <AnimatePresence>
                {packets.map(packet => (
                  <circle
                    key={packet.id}
                    r="4"
                    fill={packet.color}
                    style={{ filter: 'blur(2px)' }}
                    opacity="0"
                  >
                    <animateMotion
                      dur="1s"
                      begin="0s"
                      repeatCount="1"
                      path={`M ${x1} ${y1} L ${x2} ${y2}`}
                    />
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      dur="1s"
                      repeatCount="1"
                    />
                  </circle>
                ))}
              </AnimatePresence>

              {/* Path Active Glow */}
              <AnimatePresence>
                {packets.length > 0 && (
                  <motion.path
                    d={`M ${x1} ${y1} L ${x2} ${y2}`}
                    stroke={packets[0].color}
                    strokeWidth="2"
                    fill="none"
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: 0.3, pathLength: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ filter: 'blur(4px)' }}
                  />
                )}
              </AnimatePresence>
              {edge.label && (
                <foreignObject x={(x1 + x2) / 2 - 50} y={(y1 + y2) / 2 - 10} width="100" height="20">
                  <div className="text-[9px] font-bold uppercase tracking-tighter text-[#666670] text-center whitespace-nowrap overflow-hidden text-ellipsis">
                    {edge.label}
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}
      </svg>

      <div className="absolute inset-0 pointer-events-auto">
        {nodes.map((node, idx) => {
          const Icon = NODE_ICONS[node.type] || Zap;
          const isActive = activeNodeId === node.id;
          const nodeTraces = traces.filter((t) => t.nodeId === node.id);
          const lastTrace = nodeTraces[nodeTraces.length - 1];

          // Determine color based on type to match theme accents
          let accentColor = '#00f2ff'; // Default Cyan for Chain/Prompt
          if (node.type === 'llm') accentColor = '#bd00ff';
          if (node.type === 'tool') accentColor = '#ffbb00';
          if (node.type === 'output') accentColor = '#00ffaa';

          return (
            <motion.div
              key={node.id}
              className={`absolute cursor-pointer group`}
              style={{ left: node.x, top: node.y, transform: 'translate(-50%, -50%)' }}
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: idx * 0.1 
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNodeClick(node.id)}
            >
              <div 
                className={`relative flex flex-col items-center justify-center w-24 h-24 rounded-xl node-glass border-2 transition-all duration-300 ${isActive ? 'bg-white/10 ring-2 ring-offset-4 ring-offset-black ring-white/20' : 'hover:border-white/20'}`}
                style={{ borderColor: isActive ? accentColor : 'rgba(255,255,255,0.1)' }}
              >
                <div 
                   className="absolute top-2 left-3 flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity"
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                  <span className="text-[8px] font-bold uppercase tracking-widest text-white/40">{node.type}</span>
                </div>

                <motion.div
                   animate={{ 
                     filter: isActive ? `drop-shadow(0 0 10px ${accentColor})` : `drop-shadow(0 0 0px transparent)`,
                     scale: isActive ? 1.2 : 1
                   }}
                   className="mb-1"
                >
                  <Icon style={{ color: accentColor }} className="w-7 h-7" />
                </motion.div>
                
                {/* Visual indicator of execution - ripples */}
                <AnimatePresence>
                  {lastTrace && lastTrace.status === 'success' && (
                    <motion.div
                      className="absolute -inset-2 rounded-xl border"
                      style={{ borderColor: accentColor }}
                      initial={{ opacity: 0.8, scale: 0.9 }}
                      animate={{ opacity: 0, scale: 1.4 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </AnimatePresence>

                {isActive && (
                  <>
                    <motion.div 
                      layoutId="active-glow"
                      className="absolute -inset-8 rounded-full -z-10 blur-3xl opacity-20"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.15, 0.25, 0.15],
                        backgroundColor: [accentColor, `${accentColor}cc`, accentColor]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                    
                    {/* Tactical Corner Brackets */}
                    <motion.div 
                      className="absolute -inset-2 pointer-events-none"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: accentColor }} />
                      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: accentColor }} />
                      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: accentColor }} />
                      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: accentColor }} />
                    </motion.div>

                    {/* Scanning Beam */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent h-[2px] w-full z-20 pointer-events-none"
                      initial={{ top: "0%" }}
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      style={{ backgroundColor: accentColor }}
                    />
                  </>
                )}

                {/* Execution Burst / Flash */}
                <AnimatePresence>
                  {lastTrace && (Date.now() - lastTrace.timestamp < 1000) && (
                    <motion.div
                      key={lastTrace.id}
                      className="absolute inset-0 rounded-xl z-30 pointer-events-none"
                      initial={{ opacity: 0, scale: 1 }}
                      animate={{ 
                        opacity: [0, 0.4, 0],
                        scale: [1, 1.3],
                        backgroundColor: accentColor 
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      style={{ filter: 'blur(10px)' }}
                    />
                  )}
                </AnimatePresence>

                {/* Node Label */}
                <div className="mt-1 px-2 w-full truncate text-center text-[10px] font-bold text-white/70 tracking-tight">
                  {node.label}
                </div>

                {/* Run Trigger */}
                <button 
                   onClick={(e) => { e.stopPropagation(); onRunNode(node.id); }}
                   className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md"
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                </button>
              </div>

              {/* Status Badge */}
              {lastTrace && (
                <div className="absolute -bottom-1 -right-1">
                  <div className={`w-3 h-3 rounded-full ${lastTrace.status === 'success' ? 'bg-[#00ffaa]' : 'bg-rose-500'} shadow-[0_0_8px_rgba(0,0,0,0.5)] border border-white/20`} />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
