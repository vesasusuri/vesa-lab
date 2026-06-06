import React from 'react';
import { usePlatformAdmin } from "../../../../../context/PlatformAdminContext";

import './findjob.scss';
import { FaArrowRight } from "react-icons/fa";

const FindJob = () => {
  const { data } = usePlatformAdmin();
  const homeContent = data.homeContent || {};
  const section = (data.homeSections || []).find((s) => s.key === "find_job");
  const block = (section?.items || []).find((item) => item.isActive !== false) || (section?.items || [])[0];

  const findJobTitle = block?.title || homeContent.findJobTitle || 'Find Your Next Opportunity';
  const highlight = block?.subtitle || homeContent.findJobHighlight || 'Opportunity';
  const highlightedTitle = findJobTitle.includes(highlight) ? findJobTitle.replace(highlight, '').trim() : findJobTitle;
  const description = block?.description || homeContent.findJobDescription || 'Browse 20+ open positions across top companies. Your dream job is one search away.';
  const ctaLabel = block?.ctaText || homeContent.findJobCta || 'Explore the job market';
  const ctaHref = block?.metadata?.ctaHref || '/jobs';

  return (
    <section className="jobs-hero" data-aos="slide-up">

      <div className="blur-circle left"></div>
      <div className="blur-circle right"></div>

      <div className="jobs-hero-content">

        <h1>
          {highlightedTitle}{' '}
          <span>{highlight}</span>
        </h1>

        <p>{description}</p>

        <a href={ctaHref} className="banner-btn">
          <span>{ctaLabel}</span>
          <span className="btn-arrow">
            <FaArrowRight />
          </span>
        </a>
      </div>
    </section>
  );
};

export default FindJob;
