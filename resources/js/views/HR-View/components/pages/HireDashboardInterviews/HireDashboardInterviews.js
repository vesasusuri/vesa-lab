import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FaCalendarAlt,
  FaCopy,
  FaEdit,
  FaExternalLinkAlt,
  FaMapMarkerAlt,
  FaPlus,
  FaSearch,
  FaTrash,
  FaVideo,
} from 'react-icons/fa';
import InterviewMeeting from '../InterviewMeeting/InterviewMeeting';
import {
  createInterview,
  deleteInterview,
  listInterviews,
  updateInterview,
} from '../../../../../api/interviewsApi';
import {
  formatInterviewDate,
  formatStatusLabel,
  getInitials,
  typeLabel,
} from '../../../../../utils/interviewUtils';
import InterviewScheduleModal from '../InterviewScheduleModal/InterviewScheduleModal';
import './HireDashboardInterviews.scss';

const TABS = [
  { key: '', label: 'All' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const HireDashboardInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('');
  const [activeToken, setActiveToken] = useState('');
  const [modalInterview, setModalInterview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [copyState, setCopyState] = useState('');
  const [detailsId, setDetailsId] = useState(null);
  const [search, setSearch] = useState('');

  const loadInterviews = useCallback(async () => {
    setLoading(true);
    try {
      const params = activeTab ? { status: activeTab } : {};
      const data = await listInterviews(params);
      setInterviews(data.interviews || []);
    } catch {
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadInterviews();
  }, [loadInterviews]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return interviews;
    return interviews.filter(
      (i) =>
        i.candidate_user?.name?.toLowerCase().includes(q) ||
        i.title?.toLowerCase().includes(q) ||
        i.interviewer_name?.toLowerCase().includes(q)
    );
  }, [interviews, search]);

  const detailsInterview = useMemo(
    () => interviews.find((i) => i.id === detailsId) || null,
    [interviews, detailsId],
  );

  const handleSave = async (payload, id) => {
    if (id) {
      await updateInterview(id, { ...payload, reschedule: true });
    } else {
      await createInterview(payload);
    }
    await loadInterviews();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this interview?')) return;
    await deleteInterview(id);
    if (detailsId === id) setDetailsId(null);
    await loadInterviews();
  };

  const handleCancel = async (id) => {
    await updateInterview(id, { status: 'cancelled' });
    await loadInterviews();
  };

  const copyLink = async (link) => {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(link);
    setCopyState('Copied');
    window.setTimeout(() => setCopyState(''), 1800);
  };

  const openEmailInvite = (item) => {
    const candidate = item.candidate_user;
    const subject = encodeURIComponent(`Interview invitation: ${item.title}`);
    const body = encodeURIComponent([
      `Hi ${candidate?.name || 'there'},`,
      '',
      `Your interview for ${item.title} is scheduled for ${formatInterviewDate(item.scheduled_at)}.`,
      '',
      `Join here: ${item.join_url}`,
      '',
      'Best regards,',
      'Hiring Team',
    ].join('\n'));
    window.location.href = `mailto:${candidate?.email || ''}?subject=${subject}&body=${body}`;
  };

  if (activeToken) {
    return (
      <section className="hire-dashboard-interviews-section">
        <div className="hire-interviews-wrapper">
          <InterviewMeeting
            token={activeToken}
            onLeave={() => {
              setActiveToken('');
              loadInterviews();
            }}
          />
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="hire-dashboard-interviews-section">
        <div className="hire-interviews-wrapper">
          <div className="hire-interviews-header">
            <div>
              <span className="hire-interviews-eyebrow">Video &amp; In-Person Interviews</span>
              <h2>Interviews</h2>
            </div>
            <div className="hire-interviews-header-actions">
              <div className="hire-interviews-tabs">
                {TABS.map((tab) => (
                  <button
                    key={tab.key || 'all'}
                    type="button"
                    className={activeTab === tab.key ? 'hire-tab active' : 'hire-tab'}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="hire-interviews-schedule-btn"
                onClick={() => {
                  setModalInterview(null);
                  setShowModal(true);
                }}
              >
                <FaPlus aria-hidden="true" />
                Schedule interview
              </button>
            </div>
          </div>

          <div className="hire-list-search">
            <FaSearch className="hire-search-icon" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search by candidate, role, or interviewer…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button type="button" className="hire-search-clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>

          {loading && <p className="hire-interviews-empty">Loading interviews…</p>}

          {!loading && filtered.length === 0 && (
            <p className="hire-interviews-empty">{search ? 'No interviews match your search.' : 'No interviews found.'}</p>
          )}

          <div className="hire-interviews-list">
            {filtered.map((item) => (
              <div key={item.id} className="hire-interview-row">
                <div className="hire-interview-initials">
                  {getInitials(item.candidate_user?.name)}
                </div>

                <div className="hire-interview-info">
                  <div className="hire-interview-name">{item.candidate_user?.name}</div>
                  <div className="hire-interview-role">{item.title}</div>
                  {item.company && <div className="hire-interview-company">{item.company}</div>}
                </div>

                <span className={`hire-interview-type-badge type-${item.type}`}>
                  {item.type === 'video' ? <FaVideo aria-hidden="true" /> : <FaMapMarkerAlt aria-hidden="true" />}
                  {typeLabel(item.type)}
                </span>

                <div className="hire-interview-date">
                  <FaCalendarAlt aria-hidden="true" />
                  {formatInterviewDate(item.scheduled_at)}
                </div>

                <div className="hire-interview-interviewer">{item.interviewer_name || '—'}</div>

                <div className={`hire-interview-status status-${item.status}`}>
                  {formatStatusLabel(item.status)}
                </div>

                <div className="hire-interview-actions">
                  <button type="button" onClick={() => setDetailsId(item.id)}>Details</button>
                  <button type="button" onClick={() => copyLink(item.join_url)}>
                    <FaCopy aria-hidden="true" />
                    {copyState || 'Copy link'}
                  </button>
                  <button type="button" onClick={() => openEmailInvite(item)}>Email</button>
                  {item.type === 'video' && item.status !== 'cancelled' && (
                    <button
                      type="button"
                      className="hire-interview-join-btn"
                      onClick={() => setActiveToken(item.access_token)}
                    >
                      <FaExternalLinkAlt aria-hidden="true" />
                      Join
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setModalInterview(item);
                      setShowModal(true);
                    }}
                  >
                    <FaEdit aria-hidden="true" />
                  </button>
                  {item.status !== 'cancelled' && (
                    <button type="button" onClick={() => handleCancel(item.id)}>Cancel</button>
                  )}
                  <button type="button" onClick={() => handleDelete(item.id)}>
                    <FaTrash aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {detailsInterview && (
        <div className="hire-interview-details-overlay" onClick={() => setDetailsId(null)} role="presentation">
          <div className="hire-interview-details" onClick={(e) => e.stopPropagation()}>
            <h3>Interview details</h3>
            <p><strong>Candidate:</strong> {detailsInterview.candidate_user?.name}</p>
            <p><strong>Email:</strong> {detailsInterview.candidate_user?.email}</p>
            <p><strong>Position:</strong> {detailsInterview.title}</p>
            <p><strong>When:</strong> {formatInterviewDate(detailsInterview.scheduled_at)}</p>
            <p><strong>Duration:</strong> {detailsInterview.duration_minutes} min</p>
            <p><strong>Status:</strong> {formatStatusLabel(detailsInterview.status)}</p>
            <p><strong>Secure link:</strong> {detailsInterview.join_url}</p>
            {detailsInterview.notes && <p><strong>Notes:</strong> {detailsInterview.notes}</p>}
            <button type="button" onClick={() => setDetailsId(null)}>Close</button>
          </div>
        </div>
      )}

      {showModal && (
        <InterviewScheduleModal
          interview={modalInterview}
          onClose={() => {
            setShowModal(false);
            setModalInterview(null);
          }}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default HireDashboardInterviews;
