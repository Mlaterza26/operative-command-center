
import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Loader, Zap, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";
import { useAIChat } from "@/hooks/use-ai-chat";
import ChatMessageList from "./ChatMessageList";
import ZapierIntegrationSetup from "./ZapierIntegrationSetup";
import { Message } from "@/types/chat";

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const { 
    messages, 
    isLoading, 
    sendMessage,
    isConfigured,
    showSetup,
    setShowSetup
  } = useAIChat();

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  // Handle message sending
  const handleSendMessage = () => {
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  // Handle enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <div className="fixed right-4 bottom-4 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="default"
            size="icon"
            className={cn(
              "h-12 w-12 rounded-full shadow-md",
              "bg-gradient-to-r from-primary to-blue-600",
              "hover:shadow-lg transition-all duration-200",
              "animate-subtle-bounce"
            )}
          >
            <Bot className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="right"
          className={cn(
            "w-[90vw] sm:w-[400px] p-0 flex flex-col h-[600px] max-h-[80vh] rounded-lg overflow-hidden",
            "border border-border/40 shadow-lg",
            isDark ? "bg-gray-900" : "bg-white"
          )}
        >
          {showSetup ? (
            <ZapierIntegrationSetup onClose={() => setShowSetup(false)} />
          ) : (
            <>
              {/* Chat header */}
              <div className="flex justify-between items-center px-4 py-3 border-b border-border/40">
                <div className="flex items-center">
                  <Bot className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="font-semibold">Operative Assistant</h3>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowSetup(true)}
                    title="Configure Zapier integration"
                    className="h-8 w-8"
                  >
                    <Zap className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Chat message area */}
              <div className="flex-1 overflow-y-auto p-4">
                <ChatMessageList messages={messages} />
              </div>
              
              {/* Input area */}
              <div className="p-4 border-t border-border/40">
                <div className="relative">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything about finances or operations..."
                    className="pr-10 resize-none min-h-[40px] max-h-[120px] overflow-y-auto"
                    disabled={isLoading || !isConfigured}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "absolute right-2 top-2 h-6 w-6 rounded-full", 
                      isLoading && "animate-spin"
                    )}
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading || !isConfigured}
                  >
                    {isLoading ? <Loader className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
                {!isConfigured && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Please configure the assistant's integrations before using the chat.
                  </p>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ChatBot;
