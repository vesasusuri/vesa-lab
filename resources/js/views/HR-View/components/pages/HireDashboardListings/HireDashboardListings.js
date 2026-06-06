import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaBriefcase, FaClock, FaUsers, FaPause, FaPlay, FaTimes, FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './HireDashboardListings.scss';
import {
  deleteJobListing,
  listJobListingsForHr,
  mapJobListingForHr,
  updateJobListingStatus,
} from '../../../../../api/jobsApi';
import { useHireDashboard } from '../../../HireDashboardContext';
import PostJobModal from '../PostJobModal/PostJobModal';

const tabs = ['All', 'Active', 'Paused', 'Closed'];

const expiryClass = (days, status) => {
  if (status !== 'active') return '';
  if (days <= 3) return 'urgent';
  if (days <= 7) return 'warn';
  return '';
};

const HireDashboardListings = () => {
  const { listingsVersion, refreshListings, setJobFilter } = useHireDashboard();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [openMenu, setOpenMenu] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await listJobListingsForHr();
        if (!cancelled) {
          setListings((data.jobs || []).map(mapJobListingForHr));
        }
      } catch {
        if (!cancelled) setError('Could not load listings. Log in as HR to manage jobs.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [listingsVersion]);

  useEffect(() => {
    if (openMenu === null) return;
    const handler = (e) => {
      if (!e.target.closest('.hire-listing-menu-wrap')) setOpenMenu(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openMenu]);

  const setStatus = async (id, status) => {
    const previous = listings;
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    setOpenMenu(null);
    try {
      await updateJobListingStatus(id, status);
    } catch {
      setListings(previous);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    setOpenMenu(null);
    const previous = listings;

    try {
      await deleteJobListing(id);
      setListings((prev) => prev.filter((l) => l.id !== id));
      refreshListings();
    } catch {
      setListings(previous);
      setError('Could not delete job. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const counts = tabs.reduce((acc, t) => {
    acc[t] = t === 'All' ? listings.length : listings.filter((l) => l.status === t.toLowerCase()).length;
    return acc;
  }, {});

  const filtered = activeTab === 'All'
    ? listings
    : listings.filter((l) => l.status === activeTab.toLowerCase());

  return (
    <section className="hire-dashboard-listings-section" id="hire-listings-anchor">
      <div className="hire-listings-wrapper">

        <div className="hire-listings-header">
          <div>
            <h2>Active Listings</h2>
            <p>{listings.filter((l) => l.status === 'active').length} active · {listings.length} total</p>
          </div>
          <div className="hire-listings-tabs">
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

        {loading && <p className="hire-listings-empty">Loading listings…</p>}
        {error && !loading && <p className="hire-listings-empty">{error}</p>}

        {!loading && !error && filtered.length === 0 ? (
          <div className="hire-listings-empty">
            <p>No {activeTab.toLowerCase()} listings.</p>
          </div>
        ) : !loading && !error ? (
          <div className="hire-listings-grid">
            {filtered.map((job) => {
              const pct = job.applications > 0
                ? Math.round((job.shortlisted / job.applications) * 100)
                : 0;
              const ec = expiryClass(job.daysLeft, job.status);

              return (
                <div
                  key={job.id}
                  className={[
                    'hire-listing-card',
                    job.featured ? 'featured' : '',
                    job.status === 'paused' ? 'is-paused' : '',
                    job.status === 'closed' ? 'is-closed' : '',
                  ].filter(Boolean).join(' ')}
                >
                  <div className="hire-listing-banner">
                    <div className="hire-listing-avatar">{job.initials}</div>

                    <div className="hire-listing-menu-wrap">
                      <button
                        className="hire-listing-kebab"
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === job.id ? null : job.id); }}
                      >
                        <FaEllipsisV />
                      </button>

                      {openMenu === job.id && (
                        <div className="hire-listing-dropdown">
                          <button
                            type="button"
                            onClick={() => { setEditingJob(job); setOpenMenu(null); }}
                          >
                            <FaEdit /> Edit job
                          </button>
                          {job.status === 'active' && (
                            <button type="button" onClick={() => { setStatus(job.id, 'paused'); setOpenMenu(null); }}>
                              <FaPause /> Pause listing
                            </button>
                          )}
                          {job.status === 'paused' && (
                            <button type="button" className="menu-resume" onClick={() => { setStatus(job.id, 'active'); setOpenMenu(null); }}>
                              <FaPlay /> Resume listing
                            </button>
                          )}
                          {job.status !== 'closed' && (
                            <button type="button" className="menu-danger" onClick={() => { setStatus(job.id, 'closed'); setOpenMenu(null); }}>
                              <FaTimes /> Close listing
                            </button>
                          )}
                          {job.status === 'closed' && (
                            <button type="button" className="menu-resume" onClick={() => { setStatus(job.id, 'active'); setOpenMenu(null); }}>
                              <FaPlay /> Reopen listing
                            </button>
                          )}
                          <button
                            type="button"
                            className="menu-danger"
                            disabled={deletingId === job.id}
                            onClick={() => handleDelete(job.id, job.title)}
                          >
                            <FaTrash /> {deletingId === job.id ? 'Deleting…' : 'Delete job'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="hire-listing-body">

                    <div className="hire-listing-identity">
                      <div className="hire-listing-title">{job.title}</div>
                      <div className="hire-listing-tags">
                        {(job.types?.length ? job.types : [job.type]).map((type) => (
                          <span key={type} className="hire-listing-type-tag">{type}</span>
                        ))}
                        <span className={`hire-listing-status-pill pill-${job.status}`}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="hire-listing-meta">
                      <span><FaMapMarkerAlt /> {job.location}</span>
                      <span><FaBriefcase /> {job.company}</span>
                      <span><FaUsers /> {job.applications} applicants</span>
                    </div>

                    <div className="hire-listing-divider" />

                    <div className="hire-listing-pipeline">
                      <div className="hire-listing-pipe-track">
                        <div className="hire-listing-pipe-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="hire-listing-pipe-stats">
                        <span className="pipe-total">{job.applications} total</span>
                        <div className="pipe-breakdown">
                          <span className="pipe-dot blue">{job.reviewing} reviewing</span>
                          <span className="pipe-dot green">{job.shortlisted} shortlisted</span>
                        </div>
                      </div>
                    </div>

                    <div className="hire-listing-divider" />

                    <div className="hire-listing-footer">
                      <span className="hire-listing-posted">
                        Posted {job.postedDays === 0 ? 'today' : `${job.postedDays}d ago`}
                      </span>
                      {job.status === 'active' && (
                        <span className={`hire-listing-expiry ${ec}`}>
                          <FaClock />
                          {job.daysLeft === 0 ? 'Expires today' : `${job.daysLeft}d left`}
                        </span>
                      )}
                      {job.status === 'paused' && (
                        <span className="hire-listing-expiry">Paused</span>
                      )}
                      {job.status === 'closed' && (
                        <span className="hire-listing-expiry">Closed</span>
                      )}
                    </div>

                    {job.applications > 0 && (
                      <button
                        type="button"
                        className="hire-listing-view-applicants"
                        onClick={() => {
                          setJobFilter({ id: job.id, title: job.title });
                          navigate('/hire-dashboard/applications');
                        }}
                      >
                        <FaUsers style={{ marginRight: 6 }} />
                        View {job.applications} Applicant{job.applications !== 1 ? 's' : ''}
                      </button>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

      </div>

      {editingJob && (
        <PostJobModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onPosted={() => {
            setEditingJob(null);
            refreshListings();
          }}
        />
      )}
    </section>
  );
};

export default HireDashboardListings;
