import React from 'react';
import './scss/AdminDashboardReports.scss';

const topJobs = [
  { title: 'Backend Engineer', apps: 41, pct: 82 },
  { title: 'Frontend Developer', apps: 34, pct: 68 },
  { title: 'Data Analyst', apps: 27, pct: 54 },
  { title: 'Nurse Practitioner', apps: 22, pct: 44 },
  { title: 'UX Designer', apps: 19, pct: 38 },
];

const Applied = () => (
  <main className="admin-page">
    <div className="rep-grid">
      <div className="admin-card rep-jobs-card">
        <div className="rep-card-head">
          <span className="rep-card-title">Most Applied Positions</span>
        </div>
        <div className="rep-jobs-list">
          {topJobs.map((job) => (
            <div className="rep-job-row" key={job.title}>
              <div className="rep-job-info">
                <span className="rep-job-title">{job.title}</span>
                <span className="rep-job-apps">{job.apps} applications</span>
              </div>
              <div className="rep-job-bar">
                <div className="rep-job-fill" style={{ width: `${job.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </main>
);

export default Applied;
