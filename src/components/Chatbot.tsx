
import React, { useState, useRef, useEffect } from 'react';
import { askChatbot } from '../api';
import jsPDF from 'jspdf';

interface ChatbotProps {
  darkMode: boolean;
}

interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
}

const Chatbot: React.FC<ChatbotProps> = ({ darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: "Hi! I'm your AI travel assistant. Ask me to plan your next trip, suggest destinations, or help with travel advice!",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [itinerary, setItinerary] = useState<string | null>(null);
  const [travelLinks, setTravelLinks] = useState<{ bookings?: string; skyscanner?: string }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, itinerary]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Extract itinerary and travel links from bot message
  const parseBotMessage = (msg: string) => {
    // Simple regex for Bookings.com and Skyscanner URLs
    const bookingsMatch = msg.match(/https?:\/\/(www\.)?bookings?\.com\S*/i);
    const skyscannerMatch = msg.match(/https?:\/\/(www\.)?skyscanner\.\S*/i);
    setTravelLinks({
      bookings: bookingsMatch ? bookingsMatch[0] : undefined,
      skyscanner: skyscannerMatch ? skyscannerMatch[0] : undefined
    });

    // Extract itinerary section (simple: look for 'Itinerary:' and grab following lines)
    const itineraryMatch = msg.match(/Itinerary:(.*?)(?:\n\n|$)/is);
    setItinerary(itineraryMatch ? itineraryMatch[1].trim() : null);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await askChatbot(inputMessage);
      const botMsg = response.response || response.message || 'I apologize, but I couldn\'t process that request.';
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: botMsg,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      parseBotMessage(botMsg);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Show floating icon when closed
  if (!isOpen) {
    return (
      <div className="position-fixed bottom-0 end-0 p-3" style={{zIndex: 1050}}>
        <button
          className={`btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center chatbot-button`}
          style={{
            width: '60px',
            height: '60px',
            border: 'none',
            fontSize: '24px',
            animation: 'pulse 2s infinite'
          }}
          onClick={() => setIsOpen(true)}
          aria-label="Open chat"
          title="Chat with AI Travel Assistant"
        >
          💬
        </button>
      </div>
    );
  }

  // Modal overlay and dialog
  return (
    <div>
      {/* Overlay */}
      <div className="modal-backdrop fade show" style={{ zIndex: 1049, background: 'rgba(0,0,0,0.4)' }} onClick={() => setIsOpen(false)} />
      {/* Modal dialog */}
      <div className="position-fixed top-50 start-50 translate-middle" style={{ zIndex: 1050, minWidth: isMobile ? '98vw' : 500, maxWidth: '98vw', width: isMobile ? '98vw' : 500 }}>
        <div className={`card shadow-lg ${darkMode ? 'bg-dark text-light' : 'bg-white'}`} style={{ maxHeight: isMobile ? '90vh' : 600, minHeight: 400, overflow: 'hidden' }}>
          <div className={`card-header d-flex justify-content-between align-items-center ${darkMode ? 'bg-primary text-light' : 'bg-primary text-white'}`}>
            <strong>🤖 AI Travel Assistant</strong>
            <button
              className="btn btn-sm btn-outline-light"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              style={{ fontSize: '18px', lineHeight: 1 }}
            >
              ×
            </button>
          </div>
          <div className="card-body p-3" style={{ height: isMobile ? '40vh' : 250, overflowY: 'auto', background: darkMode ? '#23272b' : '#f8f9fa' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-3 d-flex ${msg.isUser ? 'justify-content-end' : 'justify-content-start'}`}
              >
                <div
                  className={`p-2 rounded-3 ${
                    msg.isUser
                      ? 'bg-primary text-white ms-5'
                      : `${darkMode ? 'bg-secondary text-light' : 'bg-light text-dark'} me-5`
                  }`}
                  style={{ maxWidth: '80%', wordBreak: 'break-word' }}
                >
                  <div className="small">{msg.message}</div>
                  <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="mb-3 d-flex justify-content-start">
                <div
                  className={`p-2 rounded-3 ${darkMode ? 'bg-secondary text-light' : 'bg-light text-dark'} me-5`}
                  style={{ maxWidth: '80%' }}
                >
                  <div className="small">
                    <span className="typing-indicator">
                      AI is typing
                      <span className="dots">
                        <span>.</span><span>.</span><span>.</span>
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* Itinerary and links section */}
          {(itinerary || travelLinks.bookings || travelLinks.skyscanner) && (
            <div className="px-3 pb-3">
              {itinerary && (
                <div className="mb-3">
                  <h6 className="fw-bold">Your Itinerary</h6>
                  <pre className="bg-light p-3 rounded" style={{ whiteSpace: 'pre-wrap', fontSize: '1rem', fontFamily: 'inherit' }}>{itinerary}</pre>
                  <button className="btn btn-outline-primary btn-sm" onClick={() => {
                    const doc = new jsPDF();
                    doc.text(itinerary, 10, 20);
                    doc.save('itinerary.pdf');
                  }}>Download as PDF</button>
                </div>
              )}
              {(travelLinks.bookings || travelLinks.skyscanner) && (
                <div className="mb-2">
                  <h6 className="fw-bold">Travel Links</h6>
                  {travelLinks.bookings && (
                    <div className="mb-1">
                      <a href={travelLinks.bookings} target="_blank" rel="noopener noreferrer" className="btn btn-link p-0 text-primary">Bookings.com</a>
                    </div>
                  )}
                  {travelLinks.skyscanner && (
                    <div>
                      <a href={travelLinks.skyscanner} target="_blank" rel="noopener noreferrer" className="btn btn-link p-0 text-primary">Skyscanner</a>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <div className="card-footer p-2 border-0 bg-transparent">
            <form className="d-flex" onSubmit={handleSendMessage}>
              <input
                className="form-control me-2"
                type="text"
                placeholder="Ask about travel plans, destinations..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isTyping}
                style={{ fontSize: isMobile ? '16px' : '14px' }}
              />
              <button
                className="btn btn-primary"
                type="submit"
                disabled={isTyping || !inputMessage.trim()}
              >
                {isMobile ? '↗' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
