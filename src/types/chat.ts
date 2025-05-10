
export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface WebhookPayload {
  message: string;
  context?: {
    view?: string;
    metrics?: Record<string, any>;
    url?: string;
    timestamp: string;
  };
  metadata?: Record<string, any>;
}
