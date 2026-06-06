import React, { useEffect, useState } from 'react';
import { createInterview, listCandidates } from '../../../../../api/interviewsApi';
import './ScheduleInterviewModal.scss';

const normalizeCandidate = (candidate) => {
  const id = candidate?.id ?? candidate?._id ?? candidate?.userId ?? candidate?.candidate_user_id;

  return {
    ...candidate,
    id: id ? String(id) : '',
    userId: id ? Number(id) : null,
    email: candidate?.email || '',
  };
};

const ScheduleInterviewModal = ({ candidate, onClose, onScheduled }) => {
  const [form, setForm] = useState({
    date: '',
    time: '',
    duration: '60',
    format: 'Video Call',
    note: '',
  });
  const [registeredCandidates, setRegisteredCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    listCandidates()
      .then((data) => {
        setRegisteredCandidates((data.candidates || []).map(normalizeCandidate).filter((c) => c.id));
      })
      .catch((err) => {
        setRegisteredCandidates([]);
        setError(err?.response?.data?.message || 'Unable to load registered candidates.');
      });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const formatToType = (format) => {
    if (format === 'In-person') return 'in_person';
    if (format === 'Phone') return 'phone';
    return 'video';
  };

  const resolveCandidateUserId = () => {
    const directId = candidate?.userId ?? candidate?.candidate_user_id ?? candidate?._id;
    if (directId) return Number(directId);

    const match = registeredCandidates.find(
      (c) => c.email?.toLowerCase() === candidate?.email?.toLowerCase(),
    );
    return match?.userId || null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const candidateUserId = resolveCandidateUserId();
    if (!candidateUserId) {
      setError('This candidate must register on the platform before an interview can be scheduled.');
      setLoading(false);
      return;
    }

    const scheduledAt = `${form.date}T${form.time}:00`;

    try {
      const result = await createInterview({
        candidate_user_id: candidateUserId,
        title: candidate.role || candidate.appliedRole || 'Interview',
        company: candidate.company || null,
        scheduled_at: scheduledAt,
        duration_minutes: Number(form.duration),
        type: formatToType(form.format),
        notes: form.note.trim() || null,
      });
      setSent(true);
      onScheduled?.(result.interview);
      setTimeout(() => {
        onClose();
        setSent(false);
      }, 1400);
    } catch (err) {
      const message = err?.response?.data?.message
        || Object.values(err?.response?.data?.errors || {}).flat().join(' ')
        || 'Failed to schedule interview.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sim-overlay" onClick={onClose}>
      <div className="sim-modal" onClick={(e) => e.stopPropagation()}>

        <div className="sim-header">
          <div>
            <h2>Schedule Interview</h2>
            <p>with <strong>{candidate?.name}</strong> · {candidate?.role}</p>
          </div>
          <button className="sim-close" onClick={onClose}>✕</button>
        </div>

        <form className="sim-form" onSubmit={handleSubmit}>

          <div className="sim-row">
            <div className="sim-field">
              <label>Date</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} required />
            </div>
            <div className="sim-field">
              <label>Time</label>
              <input type="time" name="time" value={form.time} onChange={handleChange} required />
            </div>
          </div>

          <div className="sim-row">
            <div className="sim-field">
              <label>Duration</label>
              <select name="duration" value={form.duration} onChange={handleChange}>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
              </select>
            </div>
            <div className="sim-field">
              <label>Format</label>
              <select name="format" value={form.format} onChange={handleChange}>
                <option>Video Call</option>
                <option>Phone</option>
                <option>In-person</option>
              </select>
            </div>
          </div>

          <div className="sim-field sim-field-full">
            <label>Message to candidate <span className="sim-hint">(optional)</span></label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="Add any details or preparation notes for the candidate…"
              rows={4}
            />
          </div>

          {error && <p className="sim-error">{error}</p>}

          <div className="sim-footer">
            <button type="button" className="sim-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="sim-submit" disabled={loading}>
              {sent ? '✓ Interview Scheduled!' : loading ? 'Scheduling…' : 'Send Invite'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ScheduleInterviewModal;
