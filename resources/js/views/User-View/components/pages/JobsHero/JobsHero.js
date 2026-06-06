import React from 'react';
import { usePlatformAdmin } from '../../../../../context/PlatformAdminContext';
import './JobsHero.scss';

function applyJobCount(description, count) {
  if (!description) return description;
  return description
    .replace(/\{count\}/gi, String(count))
    .replace(/\d+\+/g, count > 0 ? `${count}+` : description.match(/\d+\+/)?.[0] || '');
}

const JobsHero = ({ searchQuery, onSearchChange, totalJobs, filteredCount }) => {
  const { data } = usePlatformAdmin();
  const jobsCopy = data.pageContent?.jobs || {};
  const count = filteredCount > 0 ? filteredCount : totalJobs;
  const description = applyJobCount(
    jobsCopy.heroDescription || 'Search roles across design, engineering, marketing, business, and more.',
    count,
  );

  const countLabel = filteredCount === totalJobs
    ? `${totalJobs} job${totalJobs === 1 ? '' : 's'}`
    : `${filteredCount} of ${totalJobs}`;

  return (
    <section className="jobs-hero" data-aos="fade-up">
      <div className="blur-circle left" />
      <div className="blur-circle right" />

      <div className="jobs-hero-content">
        <h1>{jobsCopy.heroTitle || 'Find the right job for your next step'}</h1>

        <p>{description}</p>

        <div className="jobs-hero-search-row">
          <div className="jobs-search-box">
            <input
              type="text"
              placeholder="Search jobs, companies, or skills..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <div className="jobs-count-box">
            <span>{countLabel}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobsHero;
