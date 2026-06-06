import React from 'react';
import './JobsCards.scss';
import { useNavigate } from 'react-router-dom';
import { usePlatformAdmin } from '../../../../../context/PlatformAdminContext';

const JobsCards = ({
  jobs,
  loading,
  error,
  page,
  onPageChange,
  jobsPerPage,
}) => {
  const navigate = useNavigate();
  const { data } = usePlatformAdmin();
  const listingsTitle = data.pageContent?.jobs?.listingsTitle || 'Latest opportunities';
  const start = (page - 1) * jobsPerPage;
  const visibleJobs = jobs.slice(start, start + jobsPerPage);
  const totalPages = Math.ceil(jobs.length / jobsPerPage) || 1;

  if (loading) {
    return (
      <section className="jobs-cards-section">
        <div className="jobs-cards-wrapper">
          <p>Loading jobs…</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="jobs-cards-section">
        <div className="jobs-cards-wrapper">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  if (jobs.length === 0) {
    return (
      <section className="jobs-cards-section">
        <div className="jobs-cards-wrapper">
          <p>
            No jobs match your filters. Selected types must all appear on a job
            (a job can have other types too). Try fewer filters or a different search.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="jobs-cards-section">
      <div className="jobs-cards-wrapper">
        <h2 className="jobs-listings-heading">{listingsTitle}</h2>
        {visibleJobs.map((job, index) => (
          <div
            key={job.id}
            className={job.featured ? 'job-card featured' : 'job-card'}
            onClick={() => navigate(`/jobs/${job.id}`, { state: { job } })}
            style={{ cursor: 'pointer' }}
            data-aos="fade-up"
            data-aos-delay={index * 80}
          >
            {job.featured && <div className="featured-badge">Featured</div>}

            <div className="job-card-header">
              <div className="job-initials">{job.initials}</div>
              <div className="job-title-block">
                <h3 className="job-title">{job.title}</h3>
                <p className="job-company">{job.company}</p>
              </div>
              <div className="job-types">
                {(job.types?.length ? job.types : [job.type]).map((type) => (
                  <span key={type} className="job-type">{type}</span>
                ))}
              </div>
            </div>

            <div className="job-card-meta">
              <span className="job-meta-item">{job.location}</span>
              <span className="job-meta-divider" aria-hidden="true" />
              <span className="job-meta-item">{job.salary}</span>
              <span className="job-meta-divider" aria-hidden="true" />
              <span className="job-meta-item">{job.time}</span>
            </div>

            {job.tags.length > 0 && (
              <div className="job-tags">
                {job.tags.map((tag) => (
                  <span key={tag} className="job-tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {jobs.length > jobsPerPage && (
        <div className="jobs-pagination">
          <button type="button" onClick={() => onPageChange(page - 1)} disabled={page === 1}>{'<'}</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              className={page === pageNum ? 'active-page' : ''}
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </button>
          ))}
          <button type="button" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>{'>'}</button>
        </div>
      )}
    </section>
  );
};

export default JobsCards;
