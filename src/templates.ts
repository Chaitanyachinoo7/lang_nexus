import { Node, Edge } from './types';

export interface Template {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
}

export const TEMPLATES: Template[] = [
  {
    id: 'rag-flow',
    name: 'Retrieval Augmented Generation (RAG)',
    description: 'A standard RAG pipeline that retrieves context from a vector store and generates answers using an LLM.',
    nodes: [
      { id: 'input-1', type: 'prompt', label: 'User Query', config: { placeholder: 'Enter your question' }, x: 100, y: 150 },
      { id: 'retriever-1', type: 'tool', label: 'Vector Store', config: { collection: 'docs_v1', k: 4 }, x: 300, y: 150 },
      { id: 'prompt-1', type: 'prompt', label: 'RAG Prompt', config: { template: 'Use {context} to answer {query}' }, x: 500, y: 150 },
      { id: 'llm-1', type: 'llm', label: 'Gemini Pro', config: { model: 'gemini-1.5-pro', temp: 0.7 }, x: 700, y: 150 },
      { id: 'output-1', type: 'output', label: 'Response', config: {}, x: 900, y: 150 },
    ],
    edges: [
      { id: 'e1-2', source: 'input-1', target: 'retriever-1', label: 'query' },
      { id: 'e2-3', source: 'retriever-1', target: 'prompt-1', label: 'context' },
      { id: 'e1-3', source: 'input-1', target: 'prompt-1', label: 'query' },
      { id: 'e3-4', source: 'prompt-1', target: 'llm-1', label: 'prompt' },
      { id: 'e4-5', source: 'llm-1', target: 'output-1', label: 'answer' },
    ]
  },
  {
    id: 'agentic-chatbot',
    name: 'Agentic Chatbot',
    description: 'A chatbot with memory and tool-calling capabilities to handle complex reasoning tasks.',
    nodes: [
      { id: 'user-input', type: 'prompt', label: 'Chat Input', config: {}, x: 100, y: 250 },
      { id: 'memory-engine', type: 'memory', label: 'Window Memory', config: { size: 5 }, x: 300, y: 100 },
      { id: 'router-node', type: 'router', label: 'Intent Router', config: { rules: ['tool_use', 'direct_answer'] }, x: 300, y: 250 },
      { id: 'llm-brain', type: 'llm', label: 'Agent Core', config: { model: 'gemini-1.5-flash' }, x: 500, y: 250 },
      { id: 'tool-executor', type: 'tool', label: 'Search Tool', config: { api: 'serper' }, x: 500, y: 400 },
      { id: 'final-response', type: 'output', label: 'Chat UI', config: {}, x: 750, y: 250 },
    ],
    edges: [
      { id: 'ce-1', source: 'user-input', target: 'router-node' },
      { id: 'ce-2', source: 'memory-engine', target: 'router-node', label: 'history' },
      { id: 'ce-3', source: 'router-node', target: 'llm-brain', label: 'directed' },
      { id: 'ce-4', source: 'llm-brain', target: 'tool-executor', label: 'call' },
      { id: 'ce-5', source: 'tool-executor', target: 'llm-brain', label: 'result' },
      { id: 'ce-6', source: 'llm-brain', target: 'final-response', label: 'message' },
    ]
  },
  {
    id: 'data-scientist-agent',
    name: 'Data Analysis Agent',
    description: 'Specialized agent for processing datasets, generating insights, and creating visual summaries.',
    nodes: [
      { id: 'dataset', type: 'tool', label: 'SQL Fetcher', config: { table: 'sales_data' }, x: 100, y: 200 },
      { id: 'analyst', type: 'llm', label: 'Data Analyst LLM', config: { system: 'Be a data scientist' }, x: 350, y: 200 },
      { id: 'chart-gen', type: 'tool', label: 'Chart Builder', config: { library: 'd3.js' }, x: 600, y: 100 },
      { id: 'reporter', type: 'output', label: 'Executive Summary', config: {}, x: 600, y: 300 },
    ],
    edges: [
      { id: 'da-1', source: 'dataset', target: 'analyst', label: 'raw_data' },
      { id: 'da-2', source: 'analyst', target: 'chart-gen', label: 'specs' },
      { id: 'da-3', source: 'analyst', target: 'reporter', label: 'insights' },
    ]
  },
  {
    id: 'summary-pipeline',
    name: 'Content Summarization',
    description: 'Efficiently distill long-form content into concise executive summaries and bullet points.',
    nodes: [
      { id: 'long-doc', type: 'prompt', label: 'Source Document', config: { type: 'PDF/URL' }, x: 100, y: 200 },
      { id: 'summarizer', type: 'llm', label: 'Summarizer LLM', config: { max_tokens: 500 }, x: 400, y: 200 },
      { id: 'formatter', type: 'router', label: 'Format Router', config: { outputs: ['bullet', 'paragraph'] }, x: 700, y: 200 },
      { id: 'summary-ui', type: 'output', label: 'Final Summary', config: {}, x: 950, y: 200 },
    ],
    edges: [
      { id: 'sp-1', source: 'long-doc', target: 'summarizer' },
      { id: 'sp-2', source: 'summarizer', target: 'formatter' },
      { id: 'sp-3', source: 'formatter', target: 'summary-ui' },
    ]
  }
];
