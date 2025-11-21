import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Send, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import '../styles/global.css'; // Import global styles for consistent theming

const BRAND_NAME = "MindWell";

const AITherapistPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI therapist. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const API_KEY = process.env.REACT_APP_GROQ_API_KEY;
  const API_URL = "https://api.groq.com/openai/v1/chat/completions";
  const MODEL_NAME = "llama-3.1-8b-instant";

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const query = async (userMessage, pastMessages = []) => {
    try {
      if (!API_KEY) {
        throw new Error("API key is not configured. Please check your .env file.");
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: [
            {
              role: "system",
              content: `You are a compassionate AI therapist named ${BRAND_NAME}. Provide supportive, empathetic responses while maintaining professional boundaries. Keep responses concise and focused on the user's wellbeing.`
            },
            ...pastMessages.map((msg, index) => ({
              role: index % 2 === 0 ? "user" : "assistant",
              content: msg
            })),
            {
              role: "user",
              content: userMessage
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
          stream: false
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error Response:", errorData);
        throw new Error(errorData.error?.message || `Error from Groq API: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "I'm sorry, I didn't get a proper response.";
    } catch (error) {
      console.error("Error in query function:", error);
      return `I'm having trouble connecting to the AI service. Please try again later. (${error.message})`;
    }
  };

  const getAIResponse = async (userMessage) => {
    setIsTyping(true);
    
    try {
      // Get the last few messages for context
      const pastMessages = messages
        .filter(msg => msg.sender === 'user' || msg.sender === 'bot')
        .slice(-6) // Keep last 3 exchanges (6 messages)
        .map(msg => msg.text);

      // Call the API
      const aiResponse = await query(userMessage, pastMessages);
      
      return {
        id: Date.now(),
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date()
      };
    } catch (error) {
      console.error("Error getting AI response:", error);
      return {
        id: Date.now(),
        text: `I'm sorry, I'm having trouble processing your request. (${error.message})`,
        sender: 'bot',
        timestamp: new Date()
      };
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    try {
      // Get AI response
      const aiResponse = await getAIResponse(input);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "An error occurred while processing your message. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  };

  // Handle Enter key for sending message
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-card border-b border-border/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center">
          <motion.button 
            onClick={() => window.history.back()}
            className="mr-4 p-2 rounded-full hover:bg-accent/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-foreground/80" />
          </motion.button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{BRAND_NAME} AI Therapist</h1>
            <p className="text-sm text-muted-foreground">Always here to listen and support you</p>
          </div>
        </div>
      </header>

      {/* Chat container */}
      <div className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto w-full">
        <div className="space-y-4 pb-4">
          {messages.map((message, index) => (
            <motion.div 
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className={`flex max-w-3xl ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div 
                  className={`flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center shadow-sm ${
                    message.sender === 'user' 
                      ? 'ml-3 bg-primary/10 text-primary' 
                      : 'mr-3 bg-accent/10 text-accent'
                  }`}
                >
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div 
                  className={`px-4 py-3 rounded-xl shadow-sm ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-card border border-border rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{message.text}</p>
                  <p 
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div 
              className="flex items-center space-x-2 p-3 bg-card rounded-lg w-fit mx-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
            </motion.div>
          )}
          
      </div>
      
      <div ref={messagesEndRef} className="h-4" />
    </div>

    {/* Input area */}
    <motion.div 
      className="bg-card border-t border-border/50 py-3 px-4 shadow-sm"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative bg-card-foreground/5 rounded-lg border border-border focus-within:ring-2 focus-within:ring-accent focus-within:border-transparent transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none resize-none py-2.5 px-4 text-foreground placeholder:text-muted-foreground/60 text-sm rounded-lg"
              rows="1"
              aria-label="Type your message"
            />
          </div>
          <motion.button
            type="submit"
            disabled={!input.trim() || isTyping}
            className={`p-2.5 rounded-xl ${
              !input.trim() || isTyping 
                ? 'bg-muted text-muted-foreground/50' 
                : 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm'
            } transition-colors`}
            whileHover={!input.trim() || isTyping ? {} : { scale: 1.05 }}
            whileTap={!input.trim() || isTyping ? {} : { scale: 0.95 }}
            aria-label={isTyping ? 'Sending...' : 'Send message'}
          >
            {isTyping ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </motion.button>
        </div>
        <p className="text-xs text-center text-muted-foreground/60 mt-2">
          {BRAND_NAME} AI is here to support you. For emergencies, please contact a professional.
        </p>
      </form>
    </motion.div>
  </div>
);
};

export default AITherapistPage;