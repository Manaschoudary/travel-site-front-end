import React, { useState, useEffect } from 'react';
import { getChatHistory } from '../api';

interface TripRequestsProps {
  darkMode: boolean;
}

interface ChatHistoryItem {
  id: string;
  user_id: string;
  request: string;
  response: {
    summary: string;
    itinerary: Array<{
      city: string;
      activities: string[];
      accommodation?: string;
    }>;
    booking_links: {
      booking?: string;
      skyscanner?: string;
    };
    cities: string[];
  };
  created_at: string;
}

const TripRequests: React.FC<TripRequestsProps> = ({ darkMode }) => {
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ChatHistoryItem | null>(null);
  const [userId] = useState(() => {
    // Try to get existing user ID from localStorage or create a new one
    let storedUserId = localStorage.getItem('travel_user_id');
    if (!storedUserId) {
      storedUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('travel_user_id', storedUserId);
    }
    return storedUserId;
  });

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        setLoading(true);
        const history = await getChatHistory(userId);
        // Filter only requests that have itineraries (actual trip planning requests)
        const tripRequests = history.filter((item: ChatHistoryItem) => 
          item.response && 
          item.response.itinerary && 
          item.response.itinerary.length > 0
        );
        setChatHistory(tripRequests);
      } catch (error) {
        console.error('Failed to load trip requests:', error);
        setChatHistory([]);
      } finally {
        setLoading(false);
      }
    };

    loadChatHistory();
  }, [userId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getDestinationFromRequest = (request: string) => {
    // Extract destination keywords from the request
    const destinations = [
      'Paris', 'London', 'Tokyo', 'New York', 'Barcelona', 'Rome', 'Amsterdam', 
      'Berlin', 'Vienna', 'Prague', 'Budapest', 'Istanbul', 'Athens', 'Lisbon',
      'Madrid', 'Venice', 'Florence', 'Milan', 'Zurich', 'Copenhagen', 'Stockholm',
      'Oslo', 'Helsinki', 'Reykjavik', 'Dublin', 'Edinburgh', 'Brussels', 'Luxembourg'
    ];
    
    const lowerRequest = request.toLowerCase();
    for (const dest of destinations) {
      if (lowerRequest.includes(dest.toLowerCase())) {
        return dest;
      }
    }
    return 'Unknown Destination';
  };

  if (loading) {
    return (
      <section className={`py-5 ${darkMode ? 'bg-darker' : 'bg-white'}`}>
        <div className="container">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading your trip requests...</p>
          </div>
        </div>
      </section>
    );
  }

  if (chatHistory.length === 0) {
    return (
      <section className={`py-5 ${darkMode ? 'bg-darker' : 'bg-white'}`}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3" style={{ color: darkMode ? '#00d4aa' : '#007bff' }}>
              Your Trip Requests
            </h2>
            <p className="lead" style={{ maxWidth: '600px', margin: '0 auto' }}>
              No trip requests found yet. Start planning your next adventure by chatting with our AI assistant!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="trip-requests" className={`py-5 ${darkMode ? 'bg-darker' : 'bg-white'}`}>
        <div className="container">
          {/* Section Header */}
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3" style={{ color: darkMode ? '#00d4aa' : '#007bff' }}>
              Your Trip Requests
            </h2>
            <p className="lead" style={{ maxWidth: '600px', margin: '0 auto' }}>
              Revisit your previous travel planning conversations and itineraries
            </p>
          </div>

          {/* Trip Requests Grid */}
          <div className="row">
            {chatHistory.map((request) => (
              <div key={request.id} className="col-lg-4 col-md-6 mb-4">
                <div 
                  className={`card h-100 trip-request-card ${darkMode ? 'bg-dark text-light border-secondary' : 'bg-white'}`}
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onClick={() => setSelectedRequest(request)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h6 className="card-title mb-0" style={{ color: darkMode ? '#00d4aa' : '#007bff' }}>
                        {getDestinationFromRequest(request.request)}
                      </h6>
                      <small className="text-muted">
                        {formatDate(request.created_at)}
                      </small>
                    </div>
                    
                    <p className="card-text flex-grow-1 mb-3">
                      <strong>Request:</strong> {truncateText(request.request, 100)}
                    </p>
                    
                    <div className="mb-3">
                      <small className="text-muted d-block mb-2">Destinations:</small>
                      <div className="d-flex flex-wrap gap-1">
                        {request.response.cities.map((city, index) => (
                          <span 
                            key={index} 
                            className={`badge ${darkMode ? 'bg-secondary' : 'bg-primary'}`}
                            style={{ fontSize: '0.75rem' }}
                          >
                            📍 {city}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3">
                      <small className="text-muted d-block mb-1">
                        {request.response.itinerary.length} days planned
                      </small>
                      <div className="progress" style={{ height: '4px' }}>
                        <div 
                          className="progress-bar bg-success" 
                          style={{ width: '100%' }}
                        ></div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <button 
                        className={`btn btn-sm ${darkMode ? 'btn-outline-light' : 'btn-outline-primary'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRequest(request);
                        }}
                      >
                        View Details
                      </button>
                      <div className="d-flex gap-1">
                        {request.response.booking_links.booking && (
                          <a 
                            href={request.response.booking_links.booking}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-success"
                            onClick={(e) => e.stopPropagation()}
                            title="Book Hotels"
                          >
                            🏨
                          </a>
                        )}
                        {request.response.booking_links.skyscanner && (
                          <a 
                            href={request.response.booking_links.skyscanner}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-info"
                            onClick={(e) => e.stopPropagation()}
                            title="Book Flights"
                          >
                            ✈️
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trip Request Detail Modal */}
      {selectedRequest && (
        <div 
          className="modal show d-block" 
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}
          onClick={() => setSelectedRequest(null)}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className={`modal-content ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}>
              <div className="modal-header">
                <h5 className="modal-title">
                  Trip Request: {getDestinationFromRequest(selectedRequest.request)}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setSelectedRequest(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <h6 className="fw-bold text-primary">Original Request</h6>
                    <p className="text-muted">{selectedRequest.request}</p>
                    
                    <h6 className="fw-bold text-primary mt-4">Trip Summary</h6>
                    <p className="text-muted">{selectedRequest.response.summary}</p>

                    <div className="d-flex gap-2 mb-3">
                      <span className="badge bg-info">
                        {selectedRequest.response.itinerary.length} Days
                      </span>
                      <span className="badge bg-secondary">
                        {selectedRequest.response.cities.length} Cities
                      </span>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <h6 className="fw-bold text-primary">Daily Itinerary</h6>
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {selectedRequest.response.itinerary.map((day, index) => (
                        <div key={index} className={`card mb-3 ${darkMode ? 'bg-secondary' : 'bg-light'}`}>
                          <div className="card-header py-2">
                            <small className="fw-bold">Day {index + 1} - {day.city}</small>
                          </div>
                          <div className="card-body py-2">
                            <ul className="list-unstyled mb-0">
                              {day.activities.map((activity, actIndex) => (
                                <li key={actIndex} className="mb-1">
                                  <small>• {activity}</small>
                                </li>
                              ))}
                            </ul>
                            {day.accommodation && (
                              <div className="mt-2 pt-2 border-top">
                                <small className="text-muted">🏨 {day.accommodation}</small>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <small className="text-muted me-auto">
                  Requested on {formatDate(selectedRequest.created_at)}
                </small>
                {selectedRequest.response.booking_links.booking && (
                  <a 
                    href={selectedRequest.response.booking_links.booking}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-success btn-sm"
                  >
                    🏨 Book Hotels
                  </a>
                )}
                {selectedRequest.response.booking_links.skyscanner && (
                  <a 
                    href={selectedRequest.response.booking_links.skyscanner}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-info btn-sm"
                  >
                    ✈️ Book Flights
                  </a>
                )}
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setSelectedRequest(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TripRequests;
