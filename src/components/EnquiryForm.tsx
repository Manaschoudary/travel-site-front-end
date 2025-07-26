import React from 'react';

interface EnquiryFormProps {
  darkMode: boolean;
}


const inputClass = (darkMode: boolean) =>
  `form-control${darkMode ? ' bg-secondary text-light border-0' : ''}`;

const EnquiryForm: React.FC<EnquiryFormProps> = ({ darkMode }) => (
  <div className={`card mb-3 ${darkMode ? 'bg-dark text-light' : ''}`}>
    <div className={`card-header ${darkMode ? 'bg-info text-light' : 'bg-info text-white'}`}>Trip Suggestion / Enquiry</div>
    <div className="card-body">
      <form>
        <div className="mb-2">
          <input type="text" className={inputClass(darkMode)} placeholder="Your Name" />
        </div>
        <div className="mb-2">
          <input type="email" className={inputClass(darkMode)} placeholder="Your Email" />
        </div>
        <div className="mb-2">
          <textarea className={inputClass(darkMode)} placeholder="Your Suggestion or Enquiry"></textarea>
        </div>
        <button className="btn btn-info text-white" type="submit">Submit</button>
      </form>
    </div>
  </div>
);

export default EnquiryForm;
