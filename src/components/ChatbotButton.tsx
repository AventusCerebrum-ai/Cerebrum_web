import React, { useState, useEffect, useRef } from 'react';
import { Brain, X, SendHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar } from './ui/avatar';

interface Message {
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

// Use environment variables properly
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Different API endpoints to try (in order)
const API_ENDPOINTS = [
  // Latest v1 API with gemini-pro
  '/api/gemini/v1/models/gemini-pro:generateContent',
  // Legacy v1beta with gemini-pro
  '/api/gemini/v1beta/models/gemini-pro:generateContent',
  // Try gemini-1.5-pro with v1
  '/api/gemini/v1/models/gemini-1.5-pro:generateContent',
  // Try gemini-1.5-flash with v1
  '/api/gemini/v1/models/gemini-1.5-flash:generateContent',
];

const welcomeMessages = [
  "Hi there! I'm CerebrumAI's assistant. How can I help you today?",
  "Welcome to CerebrumAI! I'm here to answer any questions about our intelligent, multimodal triage system.",
  "CerebrumAI is a next-generation triage system that analyzes various patient inputs to deliver personalized recommendations. What would you like to know?"
];

const ChatbotButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Pulse animation state for the button
  const [isPulsing, setIsPulsing] = useState(true);
  
  // Delay showing the chatbot button to not compete with preloader
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Setup welcome message when chat is opened for the first time
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Randomly select a welcome message
      const welcomeMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
      
      setIsTyping(true);
      
      // Simulate typing effect
      setTimeout(() => {
        setMessages([
          {
            sender: 'bot',
            text: welcomeMessage,
            timestamp: new Date()
          }
        ]);
        setIsTyping(false);
      }, 1000);
      
      // Stop pulsing animation once the user has seen the chatbot
      setIsPulsing(false);
    }
  }, [isOpen, messages.length]);

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatContainerRef.current && 
        !chatContainerRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('.chatbot-button')
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMessage = {
      sender: 'user' as const,
      text: inputText.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    
    // Store the user's question to reference in fallback response
    const userQuestion = inputText.trim();
    const lowerQuestion = userQuestion.toLowerCase();
    
    // Hardcoded responses for common questions
    const getHardcodedResponse = () => {
      // General greetings
      if (lowerQuestion.match(/^(hi|hello|hey|greetings).*/i)) {
        return "Hello! I'm CerebrumAI's assistant. How can I help you today?";
      }
      
      // About CerebrumAI
      if (lowerQuestion.match(/(what is|about|tell me about) (cerebrum|cerebrumai)/i)) {
        return "CerebrumAI is a next-generation, multimodal AI system that analyzes patient inputs including text, images, and behavioral data to deliver personalized triage recommendations.";
      }
      
      // Features
      if (lowerQuestion.match(/(features|what can|capabilities|abilities)/i)) {
        return "CerebrumAI offers multimodal analysis combining text, images, and behavioral data, advanced medical triage recommendations, connection with healthcare professionals, and report analysis for medical documents.";
      }
      
      // How it works
      if (lowerQuestion.match(/(how does it work|how do you work|how it works)/i)) {
        return "CerebrumAI works by analyzing multiple data inputs like text, images, and behavioral data to provide personalized medical triage recommendations. It uses advanced AI algorithms to process this information securely and efficiently.";
      }
      
      // Security/Privacy
      if (lowerQuestion.match(/(secure|security|privacy|hipaa|compliance)/i)) {
        return "CerebrumAI is designed with security as a priority. We are HIPAA-compliant and follow strict privacy protocols to ensure all patient data is secured and handled according to healthcare industry standards.";
      }
      
      // Contact
      if (lowerQuestion.match(/(contact|support|help|email|phone)/i)) {
        return "You can contact our support team at info@cerebrum.ai for any questions or issues.";
      }
      
      // Benefits
      if (lowerQuestion.match(/(benefits|advantages|why use)/i)) {
        return "CerebrumAI provides faster, more accurate triage recommendations by analyzing multiple types of data. This leads to better healthcare outcomes, reduced wait times, and more efficient use of medical resources.";
      }
      
      // Cost/Pricing
      if (lowerQuestion.match(/(cost|price|pricing|subscription|pay)/i)) {
        return "For detailed pricing information, please visit our website at cerebrum.ai/pricing or contact our sales team at sales@cerebrum.ai.";
      }
      
      // Integration
      if (lowerQuestion.match(/(integrate|integration|connect|api)/i)) {
        return "CerebrumAI offers integration options for healthcare providers and systems. For technical details, please contact our integration team at tech@cerebrum.ai.";
      }
      
      // Thank you
      if (lowerQuestion.match(/(thank you|thanks)/i)) {
        return "You're welcome! If you have any other questions about CerebrumAI, feel free to ask.";
      }
      
      // Default response for unknown questions
      return "I understand you're asking about: \"" + userQuestion + "\". For detailed information on this topic related to CerebrumAI, please contact our support team at info@cerebrum.ai.";
    };
    
    // Get hardcoded response or use API fallback logic
    const botResponse = getHardcodedResponse();
    
    // Simulate typing delay
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        {
          sender: 'bot',
          text: botResponse,
          timestamp: new Date()
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {isVisible && (
        <>
          {/* Chat button */}
          <button 
            className={`chatbot-button fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gradient-to-r from-[#62d5d0] to-[#2d7a77] flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-50 ${isPulsing ? 'animate-pulse' : ''}`}
            onClick={toggleChat}
            aria-label="Open chatbot"
          >
            <Brain className="w-6 h-6" />
          </button>

          {/* Chat window */}
          {isOpen && (
            <div 
              ref={chatContainerRef}
              className="fixed bottom-20 right-6 w-80 sm:w-96 h-96 bg-white dark:bg-gray-900 rounded-2xl shadow-xl flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300"
              style={{ maxHeight: 'calc(100vh - 150px)' }}
            >
              {/* Chat header */}
              <div className="p-4 bg-gradient-to-r from-[#62d5d0] to-[#2d7a77] text-white flex items-center justify-between">
                <div className="flex items-center">
                  <Brain className="mr-2 h-5 w-5" />
                  <h3 className="font-medium">CerebrumAI Assistant</h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 rounded-full text-white hover:bg-white/20" 
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
          
          {/* Chat messages */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'bot' && (
                  <Avatar className="mr-2 h-8 w-8 bg-[#62d5d0]/20 text-[#2d7a77] flex items-center justify-center">
                    <Brain className="h-4 w-4" />
                  </Avatar>
                )}
                
                <div className="max-w-[80%]">
                  <div 
                    className={`px-4 py-2 rounded-2xl ${
                      message.sender === 'user' 
                        ? 'bg-[#62d5d0] text-white rounded-tr-none' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                  <p className="text-xs mt-1 text-gray-500 dark:text-gray-400 ml-2">
                    {formatTimestamp(message.timestamp)}
                  </p>
                </div>
                
                {message.sender === 'user' && (
                  <Avatar className="ml-2 h-8 w-8 bg-[#62d5d0]/20 text-[#2d7a77] flex items-center justify-center">
                    <span className="text-xs">You</span>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <Avatar className="mr-2 h-8 w-8 bg-[#62d5d0]/20 text-[#2d7a77] flex items-center justify-center">
                  <Brain className="h-4 w-4" />
                </Avatar>
                <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-2xl rounded-tl-none">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-[#62d5d0]/80 dark:bg-[#62d5d0]/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-[#62d5d0]/80 dark:bg-[#62d5d0]/50 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                    <div className="w-2 h-2 bg-[#62d5d0]/80 dark:bg-[#62d5d0]/50 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat input */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex">
            <input
              ref={inputRef}
              type="text" 
              placeholder="Type your message..."
              className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-full focus:outline-none focus:ring-2 focus:ring-[#62d5d0] dark:bg-gray-800 dark:text-white"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isTyping}
            />
            <button
              className="px-4 py-2 bg-gradient-to-r from-[#62d5d0] to-[#2d7a77] text-white rounded-r-full disabled:opacity-50"
              onClick={sendMessage}
              disabled={!inputText.trim() || isTyping}
            >
              <SendHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
        </>
      )}
    </>
  );
};

export default ChatbotButton;
