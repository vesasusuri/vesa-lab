import React, { useEffect, useState } from "react";
import { FiBriefcase, FiBookmark } from "react-icons/fi";
import { FaArrowRight, FaMapMarkerAlt, FaDollarSign } from "react-icons/fa";
import { fetchSavedJobs, unsaveJob } from "../../../../../../api/jobsApi";
import "./SavedJobs.scss";

function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');

  useEffect(() => {
    fetchSavedJobs()
      .then(setSavedJobs)
      .catch(() => setError('Could not load your saved jobs.'))
      .finally(() => setLoading(false));
  }, []);

  const handleUnsave = (jobListingId) => {
    setSavedJobs((prev) => prev.filter((j) => j.job_listing_id !== jobListingId));
    unsaveJob(jobListingId).catch(() => {
      fetchSavedJobs().then(setSavedJobs).catch(() => {});
    });
  };

  if (loading) {
    return (
      <main className="applied">
        <h1 className="applied-title">Saved Jobs</h1>
        <p style={{ color: '#888', fontSize: 14 }}>Loading your saved jobs…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="applied">
        <h1 className="applied-title">Saved Jobs</h1>
        <p style={{ color: '#bf1603', fontSize: 14 }}>{error}</p>
      </main>
    );
  }

  if (savedJobs.length === 0) {
    return (
      <main className="applied">
        <h1 className="applied-title">Saved Jobs</h1>
        <p style={{ color: '#888', fontSize: 14 }}>You haven't saved any jobs yet.</p>
      </main>
    );
  }

  return (
    <main className="applied">
      <h1 className="applied-title">Saved Jobs</h1>
      <p style={{ color: '#888', fontSize: 13, marginBottom: 20 }}>
        {savedJobs.length} saved job{savedJobs.length !== 1 ? 's' : ''}
      </p>

      <div className="jobs-list">
        {savedJobs.map((job) => (
          <section className="job-card" key={job.saved_job_id}>
            <div className="job-body">
              <div className="job-top">
                <div className="job-icon">
                  <FiBriefcase />
                </div>
                <button
                  type="button"
                  className="job-status saved saved-toggle"
                  onClick={() => handleUnsave(job.job_listing_id)}
                >
                  <FiBookmark />
                  <span>Saved</span>
                </button>
              </div>

              <h2 className="job-name">{job.title}</h2>

              <div className="job-details">
                <p className="job-text"><b>{job.company}</b></p>
                {job.location && job.location !== '—' && (
                  <p className="job-text">
                    <FaMapMarkerAlt style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    {job.location}
                  </p>
                )}
                {job.salary && job.salary !== '—' && (
                  <p className="job-text">
                    <FaDollarSign style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    {job.salary}
                  </p>
                )}
                {job.type && <p className="job-text"><b>Type:</b> {job.type}</p>}
                <p className="job-text"><b>Saved:</b> {job.saved_at}</p>
              </div>

              <a href={`/jobs/${job.job_listing_id}`} className="banner-btn2">
                <span>View Job Description</span>
                <span className="btn-arrow"><FaArrowRight /></span>
              </a>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

export default SavedJobs;
