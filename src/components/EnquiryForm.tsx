import React, { useState } from 'react';

interface EnquiryFormProps {
  darkMode: boolean;
  isAuthenticated?: boolean;
  currentUser?: { name: string; email: string } | null;
}

const EnquiryForm: React.FC<EnquiryFormProps> = ({ darkMode, isAuthenticated = false, currentUser = null }) => {
  const [formData, setFormData] = useState({
    name: isAuthenticated && currentUser ? currentUser.name : '',
    email: isAuthenticated && currentUser ? currentUser.email : '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    const userName = isAuthenticated && currentUser ? currentUser.name : formData.name;
    alert(`Thank you ${userName} for your enquiry! We will get back to you soon.`);
    setFormData({ 
      name: isAuthenticated && currentUser ? currentUser.name : '', 
      email: isAuthenticated && currentUser ? currentUser.email : '', 
      message: '' 
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={`card filter-card border-0 ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}>
      <div className="card-body p-5">
        <div className="text-center mb-4">
          <h3 className="mb-3" style={{ color: darkMode ? '#00d4aa' : '#007bff' }}>
            {isAuthenticated ? `Hi ${currentUser?.name || 'there'}! Let's Plan Your Next Journey` : "Let's Plan Your Journey"}
          </h3>
          <p className="text-muted">
            {isAuthenticated 
              ? "Since you're logged in, just tell us about your travel plans!" 
              : "Tell us about your dream destination and we'll help make it happen"
            }
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {!isAuthenticated && (
              <>
                <div className="col-md-6">
                  <label className="form-label">Your Name</label>
                  <input 
                    type="text" 
                    name="name"
                    className={`form-control ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    className={`form-control ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}
            <div className="col-12">
              <label className="form-label">Tell us about your travel plans</label>
              <textarea 
                name="message"
                className={`form-control ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
                placeholder="Where would you like to go? What kind of experience are you looking for? Any specific dates or requirements?"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="col-12 text-center">
              <button 
                className={`btn btn-lg px-5 btn-modern ${darkMode ? 'btn-outline-light' : 'btn-primary'}`} 
                type="submit"
                style={{ borderRadius: '50px' }}
              >
                Send Enquiry ✈️
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnquiryForm;
