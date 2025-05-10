
import { useState, useEffect, useCallback, useContext, createContext, ReactNode } from "react";
import { Message } from "@/types/chat";
import { useZapierConfig } from "./use-zapier-config";
import { useViewContext } from "./use-view-context";
import { toast } from "sonner";

interface AIChatContextType {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
  isConfigured: boolean;
  showSetup: boolean;
  setShowSetup: (show: boolean) => void;
}

const AIChatContext = createContext<AIChatContextType | undefined>(undefined);

export const AIChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  
  const { isConfigured: isZapierConfigured } = useZapierConfig();
  const { currentView, currentMetrics } = useViewContext();
  
  // Check if OpenAI API key is configured
  useEffect(() => {
    const storedApiKey = localStorage.getItem("openai_api_key");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    } else {
      setShowSetup(true);
    }
  }, []);
  
  // Save OpenAI API key to localStorage
  const saveApiKey = useCallback((key: string) => {
    localStorage.setItem("openai_api_key", key);
    setApiKey(key);
  }, []);
  
  // Process and detect intents in messages
  const detectIntents = useCallback((message: string) => {
    // Simple intent detection - in a real system this would be more sophisticated
    if (message.toLowerCase().includes("slack") || message.toLowerCase().includes("notify")) {
      return "slack";
    } else if (message.toLowerCase().includes("task") || message.toLowerCase().includes("asana")) {
      return "asana";
    } else if (message.toLowerCase().includes("email")) {
      return "email";
    } else if (message.toLowerCase().includes("data") || message.toLowerCase().includes("sheets")) {
      return "sheets";
    }
    return null;
  }, []);
  
  // Create the prompt with context
  const createPromptWithContext = useCallback((userMessage: string) => {
    let contextInfo = "You are an AI assistant for the Operative Control Center.";
    
    if (currentView) {
      contextInfo += ` The user is currently viewing the ${currentView} dashboard.`;
    }
    
    if (currentMetrics && Object.keys(currentMetrics).length > 0) {
      contextInfo += " The following metrics are visible: ";
      contextInfo += Object.entries(currentMetrics)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
    }
    
    return contextInfo;
  }, [currentView, currentMetrics]);
  
  // The main function to send a message to the AI
  const sendMessage = useCallback(async (message: string) => {
    if (!apiKey) {
      setShowSetup(true);
      toast.error("Please configure the OpenAI API key");
      return;
    }
    
    try {
      // Add user message to the chat
      const userMessage: Message = { role: "user", content: message };
      setMessages(prev => [...prev, userMessage]);
      
      // Add a placeholder for the assistant's response
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);
      setIsLoading(true);
      
      // Detect intents
      const intent = detectIntents(message);
      
      // Create context-aware prompt
      const contextPrompt = createPromptWithContext(message);
      
      // In a real application, we would send this to our backend proxy
      // For demonstration, we'll simulate a response
      setTimeout(() => {
        let responseContent = "";
        
        if (intent === "slack") {
          responseContent = "I'll notify the team on Slack about this. What specific information should I include in the notification?";
        } else if (intent === "asana") {
          responseContent = "I'll create a task in Asana for this. Could you provide more details about the task requirements?";
        } else if (intent === "email") {
          responseContent = "I'll send an email notification. Who should be the recipient and what's the subject?";
        } else if (intent === "sheets") {
          responseContent = "I'll look up that data in Google Sheets. Which data points are you specifically interested in?";
        } else {
          // Simulate different responses based on the message content
          if (message.toLowerCase().includes("finance")) {
            responseContent = "Based on the current finance dashboard, I can see that there are several orders with CPU cost method spanning multiple months. Would you like me to provide more details on those specific orders?";
          } else if (message.toLowerCase().includes("alert") || message.toLowerCase().includes("notification")) {
            responseContent = "I see there are currently 3 active alerts in the system. These are related to delivery variance exceeding 20% on the following campaigns: Campaign A, Campaign B, and Campaign C.";
          } else {
            responseContent = "I understand your question about the operative control center. Is there specific data or functionality you'd like me to help with?";
          }
        }
        
        // Update the message with the response
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].content = responseContent;
          return updated;
        });
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
      setIsLoading(false);
    }
  }, [apiKey, detectIntents, createPromptWithContext]);
  
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);
  
  const value = {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    isConfigured: !!apiKey && isZapierConfigured,
    showSetup,
    setShowSetup
  };
  
  return (
    <AIChatContext.Provider value={value}>
      {children}
    </AIChatContext.Provider>
  );
};

export const useAIChat = () => {
  const context = useContext(AIChatContext);
  if (context === undefined) {
    throw new Error("useAIChat must be used within an AIChatProvider");
  }
  return context;
};
