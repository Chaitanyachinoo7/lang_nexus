export type NodeType = 'llm' | 'tool' | 'prompt' | 'output' | 'router' | 'memory';

export interface Node {
  id: string;
  type: NodeType;
  label: string;
  config: Record<string, any>;
  x: number;
  y: number;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}

export interface Trace {
  id: string;
  nodeId: string;
  input: any;
  output: any;
  timestamp: string;
  duration: number;
  status: 'success' | 'error' | 'running';
}

export interface LangEcosystemState {
  graph: Graph;
  traces: Trace[];
  activeNodeId: string | null;
}
