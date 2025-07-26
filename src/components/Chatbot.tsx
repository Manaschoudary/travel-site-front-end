import React from 'react';

interface ChatbotProps {
  darkMode: boolean;
}

const Chatbot: React.FC<ChatbotProps> = ({ darkMode }) => (
  <div className="position-fixed bottom-0 end-0 p-3" style={{zIndex: 1050, maxWidth: 350, width: '100%'}}>
    <div className={`card shadow ${darkMode ? 'bg-dark text-light' : ''}` }>
      <div className={`card-header ${darkMode ? 'bg-primary text-light' : 'bg-primary text-white'}` }>
        <strong>Travel AI Chatbot</strong>
      </div>
      <div className="card-body" style={{maxHeight: 200, overflowY: 'auto'}}>
        <div className="text-muted small">Ask me to plan your next trip!</div>
        {/* Example chat history */}
        <div className="mt-2">
          <div><strong>You:</strong> Suggest a 3-day trip to Italy</div>
          <div><strong>Bot:</strong> Here’s a 3-day itinerary for Italy... <a href="#">Book hotels</a></div>
        </div>
      </div>
      <div className="card-footer p-2">
        <form className="d-flex">
          <input className="form-control me-2" type="text" placeholder="Type your prompt..." />
          <button className="btn btn-primary" type="submit">Send</button>
        </form>
      </div>
    </div>
  </div>
);

export default Chatbot;
