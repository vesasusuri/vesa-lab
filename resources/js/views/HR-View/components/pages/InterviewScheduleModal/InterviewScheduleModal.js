import React, { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { listCandidates } from '../../../../../api/interviewsApi';
import './InterviewScheduleModal.scss';

const EMPTY_FORM = {
  candidate_user_id: '',
  title: '',
  company: '',
  scheduled_at: '',
  scheduled_time: '',
  duration_minutes: '60',
  type: 'video',
  location: '',
  interviewer_name: '',
  notes: '',
};

const normalizeCandidate = (candidate) => {
  const id = candidate?.id ?? candidate?._id ?? candidate?.userId ?? candidate?.candidate_user_id;

  return {
    ...candidate,
    id: id ? String(id) : '',
    userId: id ? Number(id) : null,
    name: candidate?.name || candidate?.full_name || candidate?.email || 'Unnamed candidate',
    email: candidate?.email || '',
  };
};

const InterviewScheduleModal = ({ interview, onClose, onSave }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    listCandidates()
      .then((data) => {
        setCandidates((data.candidates || []).map(normalizeCandidate).filter((c) => c.id));
      })
      .catch((err) => {
        setCandidates([]);
        setError(err?.response?.data?.message || 'Unable to load candidates.');
      });
  }, []);

  useEffect(() => {
    if (!interview) {
      setForm(EMPTY_FORM);
      return;
    }

    const scheduled = interview.scheduled_at ? new Date(interview.scheduled_at) : null;
    const date = scheduled
      ? `${scheduled.getFullYear()}-${String(scheduled.getMonth() + 1).padStart(2, '0')}-${String(scheduled.getDate()).padStart(2, '0')}`
      : '';
    const time = scheduled
      ? `${String(scheduled.getHours()).padStart(2, '0')}:${String(scheduled.getMinutes()).padStart(2, '0')}`
      : '';

    setForm({
      candidate_user_id: String(interview.candidate_user?.id || ''),
      title: interview.title || '',
      company: interview.company || '',
      scheduled_at: date,
      scheduled_time: time,
      duration_minutes: String(interview.duration_minutes || 60),
      type: interview.type || 'video',
      location: interview.location || '',
      interviewer_name: interview.interviewer_name || '',
      notes: interview.notes || '',
    });
  }, [interview]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const scheduledAt = form.scheduled_at && form.scheduled_time
      ? `${form.scheduled_at}T${form.scheduled_time}:00`
      : null;

    if (!scheduledAt) {
      setError('Date and time are required.');
      setLoading(false);
      return;
    }

    const payload = {
      candidate_user_id: Number(form.candidate_user_id),
      title: form.title.trim(),
      company: form.company.trim() || null,
      scheduled_at: scheduledAt,
      duration_minutes: Number(form.duration_minutes),
      type: form.type,
      location: form.type === 'in_person' ? form.location.trim() || null : null,
      interviewer_name: form.interviewer_name.trim() || null,
      notes: form.notes.trim() || null,
    };

    if (!payload.candidate_user_id) {
      setError('Select a candidate before creating the interview.');
      setLoading(false);
      return;
    }

    try {
      await onSave(payload, interview?.id);
      onClose();
    } catch (err) {
      const message = err?.response?.data?.message
        || Object.values(err?.response?.data?.errors || {}).flat().join(' ')
        || 'Failed to save interview.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ism-overlay" onClick={onClose} role="presentation">
      <div className="ism-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ism-header">
          <div>
            <h2>{interview ? 'Edit interview' : 'Schedule interview'}</h2>
            <p>Assign a candidate and generate a secure interview link.</p>
          </div>
          <button type="button" className="ism-close" onClick={onClose} aria-label="Close">
            <FiX aria-hidden="true" />
          </button>
        </div>

        <form className="ism-form" onSubmit={handleSubmit}>
          <label className="ism-field">
            Candidate
            <select
              value={form.candidate_user_id}
              onChange={(e) => handleChange('candidate_user_id', e.target.value)}
              required
              disabled={Boolean(interview)}
            >
              <option value="">Select candidate</option>
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}{c.email ? ` (${c.email})` : ''}
                </option>
              ))}
            </select>
          </label>

          <label className="ism-field">
            Position / title
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Senior Frontend Developer"
              required
            />
          </label>

          <label className="ism-field">
            Company
            <input
              type="text"
              value={form.company}
              onChange={(e) => handleChange('company', e.target.value)}
              placeholder="TechHive"
            />
          </label>

          <div className="ism-row">
            <label className="ism-field">
              Date
              <input
                type="date"
                value={form.scheduled_at}
                onChange={(e) => handleChange('scheduled_at', e.target.value)}
                required
              />
            </label>
            <label className="ism-field">
              Time
              <input
                type="time"
                value={form.scheduled_time}
                onChange={(e) => handleChange('scheduled_time', e.target.value)}
                required
              />
            </label>
          </div>

          <div className="ism-row">
            <label className="ism-field">
              Duration
              <select
                value={form.duration_minutes}
                onChange={(e) => handleChange('duration_minutes', e.target.value)}
              >
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
              </select>
            </label>
            <label className="ism-field">
              Format
              <select value={form.type} onChange={(e) => handleChange('type', e.target.value)}>
                <option value="video">Video</option>
                <option value="phone">Phone</option>
                <option value="in_person">In-person</option>
              </select>
            </label>
          </div>

          {form.type === 'in_person' && (
            <label className="ism-field">
              Location
              <input
                type="text"
                value={form.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Office – Room 3A"
              />
            </label>
          )}

          <label className="ism-field">
            Interviewer
            <input
              type="text"
              value={form.interviewer_name}
              onChange={(e) => handleChange('interviewer_name', e.target.value)}
              placeholder="Sarah K."
            />
          </label>

          <label className="ism-field">
            Notes
            <textarea
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              placeholder="Optional notes for the candidate"
            />
          </label>

          {error && <p className="ism-error">{error}</p>}

          <div className="ism-footer">
            <button type="button" className="ism-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="ism-submit" disabled={loading}>
              {loading ? 'Saving…' : interview ? 'Save changes' : 'Create interview'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewScheduleModal;
