import React, { useState } from 'react';
import { FaFileAlt, FaEnvelope, FaTimes, FaCheck } from 'react-icons/fa';
import './OfferRejectionModal.scss';

const buildOffer = (candidate, company) => ({
  subject: `Offer Letter — ${candidate?.role} at ${company}`,
  body: `Dear ${candidate?.name},

We are thrilled to offer you the position of ${candidate?.role} at ${company}.

After careful consideration of your background and interview performance, we believe you would be a great addition to our team.

Please find the details of your offer below:
• Role: ${candidate?.role}
• Start Date: [Insert Start Date]
• Compensation: [Insert Salary]
• Location: [Insert Location / Remote]

Please reply to this email to confirm your acceptance by [Insert Deadline].

We look forward to welcoming you to the team!

Best regards,
${company} Hiring Team`,
});

const buildRejection = (candidate, company) => ({
  subject: `Update on your application — ${candidate?.role} at ${company}`,
  body: `Dear ${candidate?.name},

Thank you for taking the time to apply for the ${candidate?.role} position at ${company} and for your interest in joining our team.

After careful consideration, we have decided to move forward with another candidate whose experience more closely matches our current needs.

This was a competitive process and we appreciate the effort you put into your application. We encourage you to apply for future openings that may be a good fit.

We wish you all the best in your job search.

Best regards,
${company} Hiring Team`,
});

const OfferRejectionModal = ({ candidate, type, onClose }) => {
  const company = localStorage.getItem('user_company') || 'Your Company';
  const template = type === 'offer' ? buildOffer(candidate, company) : buildRejection(candidate, company);

  const [subject, setSubject] = useState(template.subject);
  const [body,    setBody]    = useState(template.body);
  const [sent,    setSent]    = useState(false);

  const handleSend = () => {
    setSent(true);
    setTimeout(() => { onClose(); setSent(false); }, 1400);
  };

  const isOffer = type === 'offer';

  return (
    <div className="orm-overlay" onClick={onClose}>
      <div className="orm-modal" onClick={(e) => e.stopPropagation()}>

        <div className="orm-header">
          <div className={`orm-type-badge ${isOffer ? 'offer' : 'reject'}`}>
            {isOffer ? '📄 Offer Letter' : '✉️ Rejection Email'}
          </div>
          <button className="orm-close" onClick={onClose}>✕</button>
        </div>

        <div className="orm-body">
          <div className="orm-to-row">
            <span className="orm-label">To</span>
            <span className="orm-to-value">{candidate?.name} &lt;{candidate?.email}&gt;</span>
          </div>

          <div className="orm-field">
            <label>Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="orm-field">
            <label>Message</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={14}
            />
          </div>
        </div>

        <div className="orm-footer">
          <button className="orm-cancel" onClick={onClose}>Cancel</button>
          <button
            className={`orm-send ${isOffer ? 'send-offer' : 'send-reject'}`}
            onClick={handleSend}
          >
            {sent
              ? `✓ ${isOffer ? 'Offer Sent!' : 'Rejection Sent!'}`
              : `Send ${isOffer ? 'Offer Letter' : 'Rejection'}`
            }
          </button>
        </div>

      </div>
    </div>
  );
};

export default OfferRejectionModal;
