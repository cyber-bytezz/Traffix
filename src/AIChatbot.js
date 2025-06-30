import React, { useState, useRef, useEffect } from 'react';
import aiService from './services/aiService';
import { useNavigate } from 'react-router-dom';
// import './AIChatbot.css';

const AIChatbot = ({ onClose }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI traffic management assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Check for report generation intent
    const lowerMsg = inputMessage.trim().toLowerCase();
    if (lowerMsg.includes('generate report') || lowerMsg.includes('create report') || lowerMsg.includes('report generator')) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: 'Redirecting you to the AI Report Generator... 📋',
          sender: 'ai',
          timestamp: new Date().toISOString()
        }]);
        setTimeout(() => navigate('/report-generator'), 1200);
      }, 500);
      setIsLoading(false);
      return;
    }

    try {
      const response = await aiService.sendMessage(inputMessage, messages);
      
      if (response.success) {
        const aiMessage = {
          id: Date.now() + 1,
          text: response.data.message,
          sender: 'ai',
          timestamp: response.data.timestamp
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        const errorMessage = {
          id: Date.now() + 1,
          text: response.error || "I'm sorry, I'm having trouble processing your request. Please try again.",
          sender: 'ai',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: error.message || "I'm sorry, something went wrong. Please try again later.",
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickReplies = [
    "Help with violations",
    "Generate report",
    "Emergency procedures",
    "Traffic rules"
  ];

  const handleQuickReply = (reply) => {
    setInputMessage(reply);
    setTimeout(() => handleSendMessage(), 100);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`fixed bottom-5 right-5 z-[1000] flex flex-col transition-all duration-300 ${isMinimized ? 'h-[60px] w-[60px]' : 'h-[500px] w-[350px]'} bg-gradient-to-br from-indigo-400 to-purple-700 rounded-2xl shadow-2xl border-2 border-white/20 overflow-hidden`}> 
      {/* Minimized Icon Only */}
      {isMinimized ? (
        <button
          className="w-full h-full flex items-center justify-center text-3xl bg-gradient-to-br from-cyan-400 to-cyan-700 rounded-full shadow-lg hover:scale-110 transition-transform border-4 border-white/40 focus:outline-none"
          aria-label="Open AI Assistant"
          onClick={() => setIsMinimized(false)}
        >
          🤖
        </button>
      ) : (
        <>
          {/* Chatbot Header */}
          <div className="flex items-center justify-between cursor-pointer px-5 py-3 bg-white/10 backdrop-blur-md border-b border-white/10" onClick={() => setIsMinimized(true)}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-700 rounded-full flex items-center justify-center text-xl shadow-[0_4px_15px_rgba(0,212,255,0.3)] animate-pulse">🤖</div>
              <div>
                <h3 className="text-white text-base font-semibold m-0">AI Assistant</h3>
                <span className="text-green-400 text-xs font-medium">Online</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                className="bg-white/20 hover:bg-white/30 transition-all rounded-full w-7 h-7 flex items-center justify-center text-white text-sm focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(true);
                }}
                title="Minimize"
              >
                {'🔽'}
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 flex flex-col overflow-y-auto px-5 py-4 bg-transparent">
            <div className="flex-1 flex flex-col gap-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex mb-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'ai' && message.text.startsWith('Here are the fine amounts for the detected violation(s):') ? (
                    <div className="max-w-[80%] px-4 py-3 rounded-2xl bg-gradient-to-br from-green-200 to-cyan-200 text-gray-900 shadow-lg border-l-4 border-green-500">
                      <div className="font-bold text-green-700 mb-2 flex items-center gap-2"><span>💸</span>Fine Amounts</div>
                      <ul className="list-disc pl-5 space-y-1">
                        {message.text.split('\n').slice(1).map((line, idx) => (
                          <li key={idx} className="text-base font-medium text-gray-800">{line.replace('• ', '')}</li>
                        ))}
                      </ul>
                      <div className="text-xs text-gray-500 mt-2">(As per latest Motor Vehicles Act)</div>
                      <div className="text-[11px] opacity-70 text-left mt-1">{formatTime(message.timestamp)}</div>
                    </div>
                  ) : (
                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl relative ${message.sender === 'user' ? 'bg-gradient-to-br from-cyan-400 to-cyan-700 text-white rounded-br-md' : 'bg-white/90 text-gray-800 rounded-bl-md'}`}>
                      <div className="mb-1">
                        {message.text.split('\n').map((line, index) => (
                          <p key={index} className="leading-snug mb-1 last:mb-0">{line}</p>
                        ))}
                      </div>
                      <div className={`text-[11px] opacity-70 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>{formatTime(message.timestamp)}</div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start mb-2">
                  <div className="max-w-[80%] px-4 py-3 rounded-2xl relative bg-white/90 text-gray-800 rounded-bl-md">
                    <div className="flex gap-1 py-2">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length === 1 && (
              <div className="mt-5 pt-4 border-t border-white/10">
                <p className="text-xs text-white/80 mb-2 text-center">Quick options:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {quickReplies.map((reply, index) => (
                    <button
                      key={index}
                      className="bg-white/20 border border-white/30 text-white px-3 py-2 rounded-full text-xs cursor-pointer transition-all backdrop-blur-md hover:bg-white/30 hover:-translate-y-0.5 shadow"
                      onClick={() => handleQuickReply(reply)}
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="px-5 py-3 bg-white/10 backdrop-blur-md border-t border-white/10">
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 resize-none rounded-xl px-4 py-2 text-sm bg-white/70 text-gray-800 border-2 border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white/90 transition-all min-h-[38px] max-h-[120px] disabled:bg-gray-200"
                rows="1"
                disabled={isLoading}
              />
              <button
                className="bg-gradient-to-r from-cyan-400 to-cyan-700 text-white px-4 py-2 rounded-full font-bold shadow hover:from-cyan-500 hover:to-cyan-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
              >
                {isLoading ? '⏳' : 'Send'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AIChatbot; 