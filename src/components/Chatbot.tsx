
import React, { useState, useRef, useEffect } from 'react';
import { askChatbot, getChatHistory } from '../api';
import jsPDF from 'jspdf';

interface ChatbotProps {
  darkMode: boolean;
}

interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
  itinerary?: TravelItinerary;
}

interface TravelItinerary {
  summary: string;
  itinerary: ItineraryDay[];
  booking_links: {
    booking?: string;
    skyscanner?: string;
  };
  cities: string[];
}

interface ItineraryDay {
  city: string;
  activities: string[];
  accommodation?: string;
}

interface ChatHistory {
  id: string;
  user_id: string;
  request: string;
  response: TravelItinerary;
  created_at: string;
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
  const [activeItinerary, setActiveItinerary] = useState<TravelItinerary | null>(null);
  const [userId] = useState(() => {
    // Try to get existing user ID from localStorage or create a new one
    let storedUserId = localStorage.getItem('travel_user_id');
    if (!storedUserId) {
      storedUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('travel_user_id', storedUserId);
    }
    return storedUserId;
  });
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeItinerary]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load chat history when component mounts
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const history = await getChatHistory(userId);
        setChatHistory(history);
        
        // Add previous conversations to messages if any
        if (history.length > 0) {
          const historyMessages: ChatMessage[] = [];
          history.slice(-3).forEach((chat: ChatHistory) => { // Show last 3 conversations
            historyMessages.push({
              id: `hist_${chat.id}_user`,
              message: chat.request,
              isUser: true,
              timestamp: new Date(chat.created_at)
            });
            historyMessages.push({
              id: `hist_${chat.id}_bot`,
              message: chat.response.summary,
              isUser: false,
              timestamp: new Date(chat.created_at),
              itinerary: chat.response
            });
          });
          setMessages(prev => [...prev, ...historyMessages]);
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    };

    loadChatHistory();
  }, [userId]);

  const generatePDF = (itinerary: TravelItinerary) => {
    const doc = new jsPDF();
    let yPosition = 20;

    // Title
    doc.setFontSize(20);
    doc.setTextColor(41, 128, 185);
    doc.text('Travel Itinerary', 20, yPosition);
    yPosition += 20;

    // Summary
    doc.setFontSize(14);
    doc.setTextColor(52, 73, 94);
    doc.text('Trip Summary:', 20, yPosition);
    yPosition += 8;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const summaryLines = doc.splitTextToSize(itinerary.summary, 170);
    doc.text(summaryLines, 20, yPosition);
    yPosition += summaryLines.length * 6 + 15;

    // Cities
    if (itinerary.cities.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(52, 73, 94);
      doc.text('Destinations:', 20, yPosition);
      yPosition += 8;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(itinerary.cities.join(', '), 20, yPosition);
      yPosition += 15;
    }

    // Daily itinerary
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Daily Itinerary:', 20, yPosition);
    yPosition += 15;

    itinerary.itinerary.forEach((day, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.setTextColor(231, 76, 60);
      doc.text(`Day ${index + 1} - ${day.city}`, 20, yPosition);
      yPosition += 10;

      if (day.accommodation) {
        doc.setFontSize(11);
        doc.setTextColor(128, 128, 128);
        doc.text(`🏨 ${day.accommodation}`, 25, yPosition);
        yPosition += 8;
      }

      day.activities.forEach((activity) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        const activityLines = doc.splitTextToSize(`• ${activity}`, 160);
        doc.text(activityLines, 25, yPosition);
        yPosition += activityLines.length * 5 + 2;
      });
      yPosition += 8;
    });

    // Booking links
    if (itinerary.booking_links.booking || itinerary.booking_links.skyscanner) {
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.setTextColor(39, 174, 96);
      doc.text('Booking Links:', 20, yPosition);
      yPosition += 10;

      if (itinerary.booking_links.booking) {
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text('Hotels: ', 25, yPosition);
        doc.setTextColor(0, 0, 255);
        doc.text(itinerary.booking_links.booking, 50, yPosition);
        yPosition += 8;
      }

      if (itinerary.booking_links.skyscanner) {
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text('Flights: ', 25, yPosition);
        doc.setTextColor(0, 0, 255);
        doc.text(itinerary.booking_links.skyscanner, 50, yPosition);
        yPosition += 8;
      }
    }

    const destinationName = itinerary.cities[0] || 'travel';
    doc.save(`${destinationName.toLowerCase().replace(/\s+/g, '_')}_itinerary.pdf`);
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
      const response = await askChatbot(inputMessage, userId);
      
      // Check if response has itinerary data
      const hasItinerary = response.itinerary && response.itinerary.length > 0;
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: response.summary || 'I apologize, but I couldn\'t process that request.',
        isUser: false,
        timestamp: new Date(),
        itinerary: hasItinerary ? response : undefined
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Set active itinerary if found
      if (hasItinerary) {
        setActiveItinerary(response);
      }
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

  const formatMessage = (message: string) => {
    // Split into paragraphs and format
    const paragraphs = message.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      // Format lists
      if (paragraph.includes('•') || paragraph.includes('-')) {
        const items = paragraph.split('\n').filter(item => item.trim());
        return (
          <ul key={index} className="mb-2 ps-3">
            {items.map((item, itemIndex) => (
              <li key={itemIndex} className="mb-1">
                {item.replace(/^[•\-]\s*/, '')}
              </li>
            ))}
          </ul>
        );
      }
      
      // Format headers (lines ending with :)
      if (paragraph.endsWith(':')) {
        return (
          <h6 key={index} className="fw-bold mb-2 text-primary">
            {paragraph}
          </h6>
        );
      }
      
      // Regular paragraphs
      return (
        <p key={index} className="mb-2">
          {paragraph}
        </p>
      );
    });
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
                  className={`p-3 rounded-3 ${
                    msg.isUser
                      ? 'bg-primary text-white ms-5'
                      : `${darkMode ? 'bg-secondary text-light' : 'bg-white text-dark border'} me-5`
                  }`}
                  style={{ maxWidth: '85%', wordBreak: 'break-word' }}
                >
                  <div className="message-content">
                    {msg.isUser ? (
                      <div>{msg.message}</div>
                    ) : (
                      <div>{formatMessage(msg.message)}</div>
                    )}
                  </div>
                  {msg.itinerary && (
                    <div className="mt-2">
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setActiveItinerary(msg.itinerary!)}
                      >
                        📋 View Full Itinerary
                      </button>
                    </div>
                  )}
                  <div className="text-muted mt-2" style={{ fontSize: '0.75rem' }}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="mb-3 d-flex justify-content-start">
                <div
                  className={`p-3 rounded-3 ${darkMode ? 'bg-secondary text-light' : 'bg-white text-dark border'} me-5`}
                  style={{ maxWidth: '80%' }}
                >
                  <div className="d-flex align-items-center">
                    <div className="typing-indicator me-2">
                      AI is typing
                    </div>
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Enhanced Itinerary Display Section */}
          {activeItinerary && (
            <div className={`border-top p-3 ${darkMode ? 'bg-dark' : 'bg-light'}`} style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0 fw-bold text-primary">
                  📋 Travel Itinerary: {activeItinerary.cities.join(', ')}
                </h6>
                <button 
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setActiveItinerary(null)}
                >
                  ✕
                </button>
              </div>
              
              <div className="row mb-3">
                <div className="col-6">
                  <small className="text-muted">Destinations</small>
                  <div className="fw-bold">{activeItinerary.cities.join(', ')}</div>
                </div>
                <div className="col-6">
                  <small className="text-muted">Days</small>
                  <div className="fw-bold">{activeItinerary.itinerary.length} days</div>
                </div>
              </div>

              {/* Summary */}
              <div className="mb-3">
                <h6 className="fw-bold mb-2">Trip Summary</h6>
                <p className="small text-muted">{activeItinerary.summary}</p>
              </div>

              {/* Daily Itinerary */}
              <div className="mb-3">
                <h6 className="fw-bold mb-2">Daily Plan</h6>
                {activeItinerary.itinerary.map((day: ItineraryDay, index: number) => (
                  <div key={index} className={`card mb-2 ${darkMode ? 'bg-secondary' : 'bg-white'}`}>
                    <div className="card-header py-2">
                      <small className="fw-bold">Day {index + 1} - {day.city}</small>
                    </div>
                    <div className="card-body py-2">
                      {day.activities.map((activity: string, actIndex: number) => (
                        <div key={actIndex} className="mb-2">
                          <div className="d-flex align-items-start">
                            <span className="badge bg-primary me-2" style={{ fontSize: '0.7rem' }}>
                              {actIndex + 1}
                            </span>
                            <small className="flex-grow-1">{activity}</small>
                          </div>
                        </div>
                      ))}
                      {day.accommodation && (
                        <div className="border-top pt-2 mt-2">
                          <small className="text-muted">🏨 {day.accommodation}</small>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-2 flex-wrap">
                <button 
                  className="btn btn-primary btn-sm pdf-download-btn"
                  onClick={() => generatePDF(activeItinerary)}
                >
                  📄 Download PDF
                </button>
                {activeItinerary.booking_links?.skyscanner && (
                  <a 
                    href={activeItinerary.booking_links.skyscanner} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm booking-link flights"
                  >
                    ✈️ Book Flights
                  </a>
                )}
                {activeItinerary.booking_links?.booking && (
                  <a 
                    href={activeItinerary.booking_links.booking} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm booking-link hotels"
                  >
                    🏨 Book Hotels
                  </a>
                )}
              </div>
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
