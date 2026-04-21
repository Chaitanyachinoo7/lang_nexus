import { GoogleGenAI } from "@google/genai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Annotation, StateGraph, END, START } from "@langchain/langgraph";

// Mocking the LangSmith integration for visualization
export const simulateTrace = (nodeId: string, input: any) => {
  return {
    id: Math.random().toString(36).substr(2, 9),
    nodeId,
    input,
    output: `Generated output for ${nodeId}...`,
    timestamp: new Date().toISOString(),
    duration: Math.floor(Math.random() * 1000) + 200,
    status: 'success' as const,
  };
};

export const createLangGraph = () => {
  const StateAnnotation = Annotation.Root({
    messages: Annotation<any[]>({
      reducer: (x, y) => x.concat(y),
    }),
  });

  const workflow = new StateGraph(StateAnnotation)
    .addNode("agent", async (state) => {
      return { messages: ["Agent thinking..."] };
    })
    .addEdge(START, "agent")
    .addEdge("agent", END);

  return workflow.compile();
};
