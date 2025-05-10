
import React from "react";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";
import ReactMarkdown from "react-markdown";

interface ChatMessageListProps {
  messages: Message[];
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages }) => {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <Bot className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
        <h3 className="text-lg font-medium">Operative Assistant</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Ask me questions about finance data, operations, or system features.
          I can help you navigate, understand metrics, or connect with other systems.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div 
          key={index} 
          className={cn(
            "flex gap-3 max-w-full",
            message.role === "user" ? "justify-end" : "justify-start"
          )}
        >
          {message.role !== "user" && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary" />
            </div>
          )}
          
          <div 
            className={cn(
              "rounded-lg px-4 py-2 max-w-[80%]",
              message.role === "user" 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted/50 border border-border/10"
            )}
          >
            {message.content ? (
              <ReactMarkdown
                className={cn(
                  "prose prose-sm max-w-none",
                  "prose-pre:bg-muted/50 prose-pre:p-2 prose-pre:rounded prose-pre:text-xs",
                  "prose-code:bg-muted/50 prose-code:p-0.5 prose-code:rounded prose-code:text-xs",
                  message.role === "user" 
                    ? "prose-headings:text-primary-foreground prose-p:text-primary-foreground" 
                    : ""
                )}
              >
                {message.content}
              </ReactMarkdown>
            ) : (
              <div className="animate-pulse flex space-x-1">
                <div className="h-2 w-2 bg-primary/60 rounded-full"></div>
                <div className="h-2 w-2 bg-primary/60 rounded-full"></div>
                <div className="h-2 w-2 bg-primary/60 rounded-full"></div>
              </div>
            )}
          </div>
          
          {message.role === "user" && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatMessageList;
