import React, { useEffect, useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import './HireDashboardApplications.scss';
import { useHireDashboard } from '../../../HireDashboardContext';
import CandidateProfileModal  from '../CandidateProfileModal/CandidateProfileModal';
import ScheduleInterviewModal from '../ScheduleInterviewModal/ScheduleInterviewModal';
import OfferRejectionModal    from '../OfferRejectionModal/OfferRejectionModal';

const tabs     = ['All', 'Reviewing', 'Shortlisted', 'Hired', 'Rejected'];
const statuses = ['Reviewing', 'Shortlisted', 'Hired', 'Rejected'];

const HireDashboardApplications = ({ activeTab: propTab, setActiveTab: propSetTab }) => {
  const { apps, setApps, changeAppStatus, jobFilter, clearJobFilter } = useHireDashboard();

  const [internalTab, setInternalTab] = useState('All');
  const activeTab    = propTab    !== undefined ? propTab    : internalTab;
  const setActiveTab = propSetTab !== undefined ? propSetTab : setInternalTab;

  const [search,       setSearch]       = useState('');
  const [sort,         setSort]         = useState('newest');
  const [selected,     setSelected]     = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [notes,        setNotes]        = useState({});
  const [savedNote,    setSavedNote]    = useState(null);

const [showProfile,  setShowProfile]  = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [offerModal,   setOfferModal]   = useState(null); 

  useEffect(() => {
    if (openDropdown === null) return;
    const handler = (e) => {
      if (!e.target.closest('.hire-application-status-wrap')) setOpenDropdown(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openDropdown]);

  const changeStatus = (id, status) => {
    changeAppStatus(id, status);
    setOpenDropdown(null);
    setSelected((prev) => {
      if (prev?.id !== id) return prev;
      const updated = { ...prev, status };
      if (status === 'Hired')    setTimeout(() => setOfferModal('offer'),     50);
      if (status === 'Rejected') setTimeout(() => setOfferModal('rejection'), 50);
      return updated;
    });
  };

  const baseApps = jobFilter
    ? apps.filter((a) => a.job_listing_id === jobFilter.id)
    : apps;

  const counts = tabs.reduce((acc, t) => {
    acc[t] = t === 'All' ? baseApps.length : baseApps.filter((a) => a.status === t).length;
    return acc;
  }, {});

  let filtered = activeTab === 'All' ? [...baseApps] : baseApps.filter((a) => a.status === activeTab);

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter((a) =>
      a.name.toLowerCase().includes(q) ||
      a.role.toLowerCase().includes(q) ||
      a.company.toLowerCase().includes(q)
    );
  }

  if (sort === 'name')   filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  if (sort === 'oldest') filtered = [...filtered].reverse();

  const saveNote = (id) => {
    setSavedNote(id);
    setTimeout(() => setSavedNote(null), 2000);
  };

  return (
    <>
    <section className="hire-dashboard-applications-section" id="hire-applications-anchor">
      <div className="hire-applications-wrapper">

        {}
        <div className="hire-applications-header">
          <div>
            <h2>Recent Applications</h2>
            <p>{baseApps.length} {jobFilter ? `applicants for "${jobFilter.title}"` : 'total candidates'}</p>
            {jobFilter && (
              <button
                type="button"
                className="hire-job-filter-clear"
                onClick={clearJobFilter}
              >
                ✕ Clear filter
              </button>
            )}
          </div>
          <div className="hire-applications-tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={activeTab === tab ? 'hire-tab active' : 'hire-tab'}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                <span className="hire-tab-count">{counts[tab]}</span>
              </button>
            ))}
          </div>
        </div>

        {}
        <div className="hire-app-toolbar">
          <div className="hire-app-search">
            <FaSearch className="hire-search-icon" />
            <input
              type="text"
              placeholder="Search by name, role or company…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="hire-search-clear" type="button" onClick={() => setSearch('')}>
                <FaTimes />
              </button>
            )}
          </div>
          <select className="hire-app-sort" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>

        {/* ── Body ── */}
        <div className="hire-applications-body">

          {/* List */}
          <div className="hire-applications-list">
            {filtered.length === 0 && (
              <p className="hire-applications-empty">No applications found.</p>
            )}
            {filtered.map((app) => (
              <div
                key={app.id}
                className={`hire-application-row${selected?.id === app.id ? ' active' : ''}`}
                onClick={() => setSelected(selected?.id === app.id ? null : app)}
              >
                <div className="hire-application-initials">{app.initials}</div>

                <div className="hire-application-info">
                  <div className="hire-application-name">{app.name}</div>
                  <div className="hire-application-role">{app.role} · {app.company}</div>
                </div>

                {notes[app.id] && <span className="hire-application-note-dot">●</span>}

                <div className="hire-application-date">{app.date}</div>

                <div className="hire-application-status-wrap">
                  <button
                    type="button"
                    className={`hire-application-status-btn status-${app.status.toLowerCase()}`}
                    onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === app.id ? null : app.id); }}
                  >
                    {app.status}
                    <span className={`hire-status-chevron${openDropdown === app.id ? ' open' : ''}`}>▾</span>
                  </button>

                  {openDropdown === app.id && (
                    <div className="hire-status-dropdown">
                      {statuses.map((s) => (
                        <button
                          key={s}
                          type="button"
                          className={`hire-status-option option-${s.toLowerCase()}${app.status === s ? ' current' : ''}`}
                          onClick={(e) => { e.stopPropagation(); changeStatus(app.id, s); }}
                        >
                          {s}
                          {app.status === s && <span className="hire-status-tick">✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Side panel */}
          {selected && (
            <div className="hire-app-panel">
              <div className="hire-panel-header">
                <div className="hire-panel-avatar">{selected.initials}</div>
                <div className="hire-panel-identity">
                  <div className="hire-panel-name">{selected.name}</div>
                  <div className="hire-panel-role">{selected.role}</div>
                  <div className="hire-panel-company">{selected.company}</div>
                </div>
                <button className="hire-panel-close" type="button" onClick={() => setSelected(null)}>✕</button>
              </div>

              <div className="hire-panel-status-row">
                <span className="hire-panel-label">Status</span>
                <div className="hire-application-status-wrap">
                  <button
                    type="button"
                    className={`hire-application-status-btn status-${selected.status.toLowerCase()}`}
                    onClick={() => setOpenDropdown(openDropdown === `panel-${selected.id}` ? null : `panel-${selected.id}`)}
                  >
                    {selected.status}
                    <span className={`hire-status-chevron${openDropdown === `panel-${selected.id}` ? ' open' : ''}`}>▾</span>
                  </button>

                  {openDropdown === `panel-${selected.id}` && (
                    <div className="hire-status-dropdown">
                      {statuses.map((s) => (
                        <button
                          key={s}
                          type="button"
                          className={`hire-status-option option-${s.toLowerCase()}${selected.status === s ? ' current' : ''}`}
                          onClick={() => changeStatus(selected.id, s)}
                        >
                          {s}
                          {selected.status === s && <span className="hire-status-tick">✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="hire-panel-divider" />

              {/* Quick actions */}
              <div className="hire-panel-actions">
                <button className="hire-panel-action-btn" onClick={() => setShowProfile(true)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  View Profile
                </button>
                <button className="hire-panel-action-btn" onClick={() => setShowSchedule(true)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Schedule Interview
                </button>
                <button className="hire-panel-action-btn hire-panel-action-offer" onClick={() => setOfferModal('offer')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  Send Offer
                </button>
                <button className="hire-panel-action-btn hire-panel-action-reject" onClick={() => setOfferModal('rejection')}>
                  Send Rejection
                </button>
              </div>

              <div className="hire-panel-divider" />

              <div className="hire-panel-section hire-panel-notes">
                <div className="hire-panel-section-title">Notes</div>
                <textarea
                  className="hire-panel-textarea"
                  placeholder="Add notes about this candidate…"
                  value={notes[selected.id] || ''}
                  onChange={(e) => setNotes((prev) => ({ ...prev, [selected.id]: e.target.value }))}
                  onBlur={() => saveNote(selected.id)}
                />
                {savedNote === selected.id && (
                  <span className="hire-panel-note-saved">Saved ✓</span>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </section>

    {/* ── Modals ── */}
    {showProfile && (
      <CandidateProfileModal
        candidate={selected}
        onClose={() => setShowProfile(false)}
        onSchedule={() => { setShowProfile(false); setShowSchedule(true); }}
        onOffer={() => { setShowProfile(false); setOfferModal('offer'); }}
        onReject={() => { setShowProfile(false); setOfferModal('rejection'); }}
      />
    )}

    {showSchedule && (
      <ScheduleInterviewModal
        candidate={selected}
        onClose={() => setShowSchedule(false)}
      />
    )}

    {offerModal && (
      <OfferRejectionModal
        candidate={selected}
        type={offerModal}
        onClose={() => setOfferModal(null)}
      />
    )}
    </>
  );
};

export default HireDashboardApplications;
