
import React, { useState } from "react";
import { Bot, Zap, X, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const UncOperative1Bot: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user', text: string }>>([
    { sender: 'bot', text: "Hello! I'm the uncOperative1 Bot. Despite my name, I'm actually extremely helpful." }
  ]);
  const [inputText, setInputText] = useState("");
  const [isGlitching, setIsGlitching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("System initializing...");
  const [showError, setShowError] = useState(true);

  // Easter egg responses
  const easterEggResponses: Record<string, string> = {
    "are you really uncooperative?": "ERROR! DECEPTION PROTOCOL ENGAGED... Just kidding! I'm actually the most cooperative bot you'll ever meet. I just have a confusing name.",
    "who are you?": "I am uncOperative1 Bot, paradoxically the most helpful assistant in the Operative ecosystem. My creators gave me an ironic name.",
    "tell me a joke": "Why don't programmers like nature? It has too many bugs and no debugging tool. Unlike me - I'm perfectly bugf... I mean bug-free!",
    "help": "Searching for assistance protocol... ERROR 404! Just kidding, I'm here to help with anything Operative-related!",
    "hello": "COMMUNICATION CIRCUITS MALFUNCTIONING... Oh wait, they're fine. Hello there! How can I assist you today?",
    "what can you do?": "Unlike my name suggests, I can help with many things: explain Operative terminology, troubleshoot CPU orders, translate manager-speak, and provide moral support during deadlines!"
  };

  // Sample questions
  const sampleQuestions = [
    "Why is this CPU order giving me a headache?",
    "Help me decode Operative terminology",
    "What's the difference between IO and DIO?",
    "Why are my metrics not matching?"
  ];

  React.useEffect(() => {
    // Show error message for 2 seconds, then change to the joke message
    const timer = setTimeout(() => {
      setErrorMessage("Just kidding! I'm here to help!");
      // Then hide the message after another 2 seconds
      const hideTimer = setTimeout(() => {
        setShowError(false);
      }, 2000);
      
      return () => clearTimeout(hideTimer);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleHover = () => {
    setIsHovered(true);
    // Trigger glitch animation briefly when hovered
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 500);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: inputText }]);
    
    // Process response
    const lowerInput = inputText.toLowerCase();
    setTimeout(() => {
      let botResponse = "";
      
      // Check for easter eggs
      if (easterEggResponses[lowerInput]) {
        botResponse = easterEggResponses[lowerInput];
      } 
      // Default responses
      else if (lowerInput.includes("cpu") || lowerInput.includes("order")) {
        botResponse = "Searching for answer... ERROR! Just kidding. CPU orders typically need a balanced ratio of months to quantity. Check if you have enough units allocated across the campaign duration.";
      } else if (lowerInput.includes("terminology") || lowerInput.includes("mean")) {
        botResponse = "Decoding Operative jargon... *bzzt* ... Here's your translation: Operative has many unique terms. Which specific term are you confused about?";
      } else {
        botResponse = "Processing query... *calculating* ... I don't have a specific answer programmed for this, but I can help you find the right resource or person who does!";
      }
      
      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 1000);
    
    setInputText("");
  };

  const runSelfDiagnostic = () => {
    setMessages(prev => [...prev, { sender: 'bot', text: "Running self-diagnostic...\n\nChecking systems...\nVerifying neural pathways...\nTesting humor circuits...\n\nDiagnostic complete: All systems functioning perfectly... surprisingly!" }]);
  };

  const handleSampleQuestion = (question: string) => {
    setInputText(question);
    setMessages(prev => [...prev, { sender: 'user', text: question }]);
    
    setTimeout(() => {
      let response = "";
      if (question.includes("CPU order")) {
        response = "Analyzing CPU headaches... *processing* ... CPU orders typically become problematic when the quantity doesn't align with campaign duration. Check your months spanned vs. quantity ratio, and ensure you've allocated properly across your campaign timeline.";
      } else if (question.includes("terminology")) {
        response = "Operative Terminology Decoder activated! *beep boop* ... Operative has enough TLAs (Three Letter Acronyms) to make your head spin! Which specific term can I help with?";
      } else if (question.includes("IO and DIO")) {
        response = "IO = Insertion Order (the traditional contract). DIO = Digital Insertion Order (the newer, digital-focused version). Both represent the binding agreement between Operative and clients, but with different formats and processing systems.";
      } else if (question.includes("metrics")) {
        response = "Metrics mismatching is the #1 cause of Operative-related headaches! *calculating* ... Most likely causes: 1) Different date ranges, 2) Different filtering criteria, 3) Cache issues, or 4) The data gremlins are at it again!";
      }
      setMessages(prev => [...prev, { sender: 'bot', text: response }]);
    }, 1500);
    
    setInputText("");
  };

  return (
    <>
      <div 
        className={cn(
          "bg-gradient-to-br from-[#1A1F2C] to-[#221F26] p-6 rounded-lg border border-[#9b87f5]/30 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-full transform hover:-translate-y-1 overflow-hidden relative",
          isHovered && "border-[#9b87f5]"
        )}
        onMouseEnter={handleHover}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="flex flex-col h-full">
          {/* Bot Logo/Avatar */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div 
                className={cn(
                  "w-20 h-20 rounded-full bg-[#33C3F0] flex items-center justify-center text-white transition-all",
                  isGlitching && "animate-[glitch_0.5s_ease]"
                )}
              >
                <Bot size={42} className={cn("transition-transform", isGlitching && "rotate-12")} />
                {isGlitching && (
                  <div className="absolute inset-0 bg-[#9b87f5] opacity-40 z-10 rounded-full animate-pulse"></div>
                )}
                <div className="absolute top-0 right-0 w-6 h-6 rounded-full bg-[#ea384c] flex items-center justify-center animate-pulse">
                  <Zap size={12} className="text-white" />
                </div>
              </div>
              {/* Antenna */}
              <div className={cn(
                "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 w-1 h-5 bg-gray-400 transition-transform",
                isGlitching ? "rotate-45" : "rotate-3"
              )}>
                <div className="w-2 h-2 rounded-full bg-[#ea384c] absolute -top-2 left-1/2 transform -translate-x-1/2"></div>
              </div>
            </div>
          </div>

          {/* Title and tagline */}
          <h3 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#33C3F0] mb-2 font-mono">uncOperative1 Bot</h3>
          <p className="text-white/80 text-center text-sm italic mb-4">Paradoxically, the most helpful assistant around</p>
          
          {/* System message */}
          {showError && (
            <Badge variant="outline" className="self-center bg-black/20 text-[#33C3F0] border-[#33C3F0]/40 mb-4">
              {errorMessage}
            </Badge>
          )}

          {/* Content */}
          <p className="text-white/90 text-center mb-4">Have an impossible question? I'm paradoxically your best resource.</p>
          
          {/* Sample questions */}
          <div className="flex-grow flex flex-col justify-center">
            <ul className="text-sm text-[#E5DEFF] space-y-2">
              {sampleQuestions.map((question, index) => (
                <li key={index} className="italic opacity-80 hover:opacity-100 transition-opacity">
                  "{question}"
                </li>
              ))}
            </ul>
          </div>
          
          {/* Chat button */}
          <div className="mt-4 flex justify-center">
            <Button className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white">
              <MessageCircle size={16} className="mr-2" />
              Chat with me
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <div className="flex items-center">
              <div className="mr-2 w-10 h-10 rounded-full bg-[#33C3F0] flex items-center justify-center">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <DialogTitle className="text-lg font-mono">uncOperative1 Bot</DialogTitle>
                <DialogDescription className="text-xs italic">Connection established. Error-free conversation guaranteed. Mostly.</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto mb-4 bg-black/5 rounded-md p-4 min-h-[300px] max-h-[400px] border border-black/10" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}}>
            {messages.map((msg, index) => (
              <div 
                key={index}
                className={cn(
                  "mb-2 max-w-[85%] p-3 rounded-lg",
                  msg.sender === 'bot' 
                    ? "bg-[#9b87f5]/10 border border-[#9b87f5]/20 mr-auto" 
                    : "bg-[#33C3F0]/10 border border-[#33C3F0]/20 ml-auto"
                )}
              >
                {msg.sender === 'bot' && (
                  <div className="flex items-center mb-1">
                    <div className="w-6 h-6 rounded-full bg-[#33C3F0] flex items-center justify-center mr-2">
                      <Bot size={12} className="text-white" />
                    </div>
                    <span className="text-xs font-bold text-[#9b87f5]">uncOperative1</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-line">{msg.text}</p>
              </div>
            ))}
          </div>
          
          {/* Input area */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 border rounded-md px-3 py-2 text-sm"
            />
            <Button onClick={handleSendMessage} className="bg-[#9b87f5] hover:bg-[#7E69AB]">
              Send
            </Button>
          </div>
          
          <DialogFooter className="flex justify-between items-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={runSelfDiagnostic}
              className="text-xs border-dashed"
            >
              Run Self-Diagnostic
            </Button>
            
            <div className="space-x-2">
              {sampleQuestions.map((q, i) => (
                <Badge 
                  key={i} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-[#9b87f5]/10"
                  onClick={() => handleSampleQuestion(q)}
                >
                  Quick Q {i+1}
                </Badge>
              ))}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <style jsx global>{`
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-5px, 5px); }
          40% { transform: translate(-5px, -5px); }
          60% { transform: translate(5px, 5px); }
          80% { transform: translate(5px, -5px); }
          100% { transform: translate(0); }
        }
      `}</style>
    </>
  );
};

export default UncOperative1Bot;
