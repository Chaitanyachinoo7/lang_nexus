import { Node, Edge } from './types';

export const INITIAL_NODES: Node[] = [
  { id: 'n1', type: 'prompt', label: 'System Persona', config: { text: 'You are a helpful assistant.' }, x: 100, y: 100 },
  { id: 'n2', type: 'llm', label: 'Gemini 3 Flash', config: { model: 'gemini-3-flash-preview' }, x: 300, y: 100 },
  { id: 'n3', type: 'tool', label: 'Web Search', config: { tool: 'google-search' }, x: 300, y: 250 },
  { id: 'n4', type: 'output', label: 'Final Answer', config: {}, x: 500, y: 150 },
];

export const INITIAL_EDGES: Edge[] = [
  { id: 'e1', source: 'n1', target: 'n2' },
  { id: 'e2', source: 'n2', target: 'n3', label: 'requires search?' },
  { id: 'e3', source: 'n3', target: 'n2', label: 'search results' },
  { id: 'e4', source: 'n2', target: 'n4' },
];
