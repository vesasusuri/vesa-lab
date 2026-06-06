import React, { useEffect, useState } from 'react';
import { FiBriefcase } from 'react-icons/fi';
import { FaArrowRight, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';
import { fetchMyApplications } from '../../../../../../api/hrApi';
import './AppliedJobs.scss';

const statusClass = (status) => {
  const s = status?.toLowerCase();
  if (s === 'hired')      return 'success';
  if (s === 'reviewing')  return 'pending';
  if (s === 'shortlisted') return 'pending';
  if (s === 'rejected')   return 'rejected';
  return 'pending';
};

function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');

  useEffect(() => {
    fetchMyApplications()
      .then(setApplications)
      .catch(() => setError('Could not load your applications.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="applied">
        <h1 className="applied-title">Applied Jobs</h1>
        <p style={{ color: '#888', fontSize: 14 }}>Loading your applications…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="applied">
        <h1 className="applied-title">Applied Jobs</h1>
        <p style={{ color: '#bf1603', fontSize: 14 }}>{error}</p>
      </main>
    );
  }

  if (applications.length === 0) {
    return (
      <main className="applied">
        <h1 className="applied-title">Applied Jobs</h1>
        <p style={{ color: '#888', fontSize: 14 }}>You haven't applied to any jobs yet.</p>
      </main>
    );
  }

  return (
    <main className="applied">
      <h1 className="applied-title">Applied Jobs</h1>
      <p style={{ color: '#888', fontSize: 13, marginBottom: 20 }}>
        {applications.length} application{applications.length !== 1 ? 's' : ''}
      </p>

      <div className="jobs-list">
        {applications.map((app) => (
          <section className="job-card" key={app.id}>
            <div className="job-body">
              <div className="job-top">
                <div className="job-icon">
                  <FiBriefcase />
                </div>
                <span className={`job-status ${statusClass(app.status)}`}>
                  {app.status}
                </span>
              </div>

              <h2 className="job-name">{app.job.title}</h2>

              <div className="job-details">
                <p className="job-text"><b>{app.job.company}</b></p>
                {app.job.location && (
                  <p className="job-text">
                    <FaMapMarkerAlt style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    {app.job.location}
                  </p>
                )}
                {app.job.salary && (
                  <p className="job-text">
                    <FaDollarSign style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    {app.job.salary}
                  </p>
                )}
                <p className="job-text"><b>Applied:</b> {app.date}</p>
                <p className="job-text"><b>Type:</b> {app.job.type}</p>
              </div>

              {app.job.id && (
                <a href={`/jobs/${app.job.id}`} className="banner-btn2">
                  <span>View job description</span>
                  <span className="btn-arrow"><FaArrowRight /></span>
                </a>
              )}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

export default AppliedJobs;
