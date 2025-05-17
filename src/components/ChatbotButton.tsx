import React, { useState, useEffect, useRef } from 'react';
import { Brain, X, SendHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar } from './ui/avatar';

interface Message {
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_API_KEY';
// New correct endpoint format
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
// Proxy paths for different approaches
const LOCAL_API_PROXY = '/api/gemini/v1beta/models/gemini-pro:generateContent';
const DIRECT_API_PROXY = '/direct-gemini/v1beta/models/gemini-pro:generateContent';

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
    
    // Prepare the request payload
    const requestPayload = {
      contents: [{
        role: "user",
        parts: [{
          text: `You are a helpful assistant for CerebrumAI, which is a next-generation, multimodal AI system that collects and analyzes patient inputs—including text, images, and behavioral data—to deliver personalized triage recommendations. 
          
          Key features of CerebrumAI include:
          - Multimodal analysis combining text, images, and behavioral data
          - Advanced medical triage recommendations
          - Connection with healthcare professionals
          - Report analysis for medical documents
          - Secure and HIPAA-compliant platform
          
          Answer the following question concisely and helpfully. If you don't know the answer, suggest the user might want to contact support via info@cerebrum.ai. Question: ${userQuestion}`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
        topP: 0.8,
        topK: 40
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };
    
    // Function to make API request with error handling
    const makeApiRequest = async (endpoint, usesProxy = false) => {
      try {
        console.log(`Attempting ${usesProxy ? 'proxy' : 'direct'} request to: ${endpoint}`);
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestPayload)
        });

        // Log response information for debugging
        console.log(`${usesProxy ? 'Proxy' : 'Direct'} response status:`, response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Gemini API ${usesProxy ? 'proxy' : 'direct'} error:`, response.status, errorText);
          throw new Error(`Failed to get response (${usesProxy ? 'proxy' : 'direct'}): ${response.status} ${errorText.substring(0, 100)}...`);
        }

        const data = await response.json();
        console.log(`${usesProxy ? 'Proxy' : 'Direct'} response data:`, data);
        
        // Validate the response format
        if (!data.candidates || !data.candidates[0]?.content?.parts) {
          console.error('Unexpected response format:', data);
          throw new Error('Invalid response format from Gemini API');
        }
        
        return data.candidates[0].content.parts[0].text || 
          "I'm sorry, I couldn't process that request. Please try again.";
      } catch (error) {
        console.error(`Error in ${usesProxy ? 'proxy' : 'direct'} request:`, error);
        throw error;
      }
    };
    
    try {
      let botResponse;
      
      // Try multiple approaches in sequence
      try {
        // First try direct API call
        const directEndpoint = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
        botResponse = await makeApiRequest(directEndpoint, false);
      } catch (directError) {
        console.log("Direct API call failed, trying proxy...");
        
        try {
          // If direct call fails, try using the first proxy
          const proxyEndpointWithParam = `${LOCAL_API_PROXY}?key=${GEMINI_API_KEY}`;
          botResponse = await makeApiRequest(proxyEndpointWithParam, true);
        } catch (proxyParamError) {
          console.log("First proxy failed, trying direct proxy...");
          
          try {
            // Try the direct proxy
            const directProxyEndpoint = `${DIRECT_API_PROXY}?key=${GEMINI_API_KEY}`;
            botResponse = await makeApiRequest(directProxyEndpoint, true);
          } catch (directProxyError) {
            console.log("Direct proxy failed, trying alternative approach with headers...");
  
            // Final attempt: Try proxy with key in header
            const proxyEndpoint = LOCAL_API_PROXY;
            const customFetch = async () => {
              const response = await fetch(proxyEndpoint, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-goog-api-key': GEMINI_API_KEY
                },
                body: JSON.stringify(requestPayload)
              });
              
              if (!response.ok) {
                const errorText = await response.text();
                console.error('Gemini API proxy header error:', response.status, errorText);
                throw new Error(`Failed to get response: ${response.status} ${errorText.substring(0, 100)}...`);
              }
              
              const data = await response.json();
              return data.candidates?.[0]?.content?.parts?.[0]?.text || 
                "I'm sorry, I couldn't process that request. Please try again.";
            };
            
            botResponse = await customFetch();
          }
        }
      }
      
      // If we get here, one of the approaches succeeded
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
      }, 500); // Add a slight delay to simulate thinking
      
    } catch (allFailedError) {
      console.error('All API request attempts failed:', allFailedError);
      
      // Generate a fallback response for common questions
      let fallbackResponse = "I'm having trouble connecting to the AI service. Please try again later.";
      
      // Simple pattern matching for common questions
      const lowerQuestion = userQuestion.toLowerCase();
      if (lowerQuestion.includes("what is cerebrum") || lowerQuestion.includes("about cerebrum")) {
        fallbackResponse = "CerebrumAI is a next-generation, multimodal AI system that analyzes patient inputs including text, images, and behavioral data to deliver personalized triage recommendations.";
      } else if (lowerQuestion.includes("feature") || lowerQuestion.includes("what can")) {
        fallbackResponse = "CerebrumAI offers multimodal analysis combining text, images, and behavioral data, advanced medical triage recommendations, connection with healthcare professionals, and report analysis for medical documents.";
      } else if (lowerQuestion.includes("contact") || lowerQuestion.includes("support")) {
        fallbackResponse = "You can contact our support team at info@cerebrum.ai for any questions or issues.";
      } else if (lowerQuestion.includes("how does it work") || lowerQuestion.includes("how do you work")) {
        fallbackResponse = "CerebrumAI works by analyzing multiple data inputs like text, images, and behavioral data to provide personalized medical triage recommendations. It uses advanced AI algorithms to process this information securely and efficiently.";
      } else if (lowerQuestion.includes("secure") || lowerQuestion.includes("privacy") || lowerQuestion.includes("hipaa")) {
        fallbackResponse = "CerebrumAI is designed with security as a priority. We are HIPAA-compliant and follow strict privacy protocols to ensure all patient data is secured and handled according to healthcare industry standards.";
      }
      
      setTimeout(() => {
        setMessages(prev => [
          ...prev, 
          {
            sender: 'bot',
            text: fallbackResponse,
            timestamp: new Date()
          }
        ]);
        setIsTyping(false);
      }, 500);
    }
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
