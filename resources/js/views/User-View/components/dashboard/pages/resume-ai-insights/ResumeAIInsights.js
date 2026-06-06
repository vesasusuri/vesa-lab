import React from 'react';
import { FiAlertCircle, FiCheckCircle, FiTrendingUp, FiZap } from 'react-icons/fi';
import './ResumeAIInsights.scss';

const SCORE_TIERS = [
  { label: 'Beginner', max: 25 },
  { label: 'Basic', max: 50 },
  { label: 'Good', max: 75 },
  { label: 'Excellent', max: 100 },
];

function getScoreTier(score) {
  if (score >= 76) return 3;
  if (score >= 51) return 2;
  if (score >= 26) return 1;
  return 0;
}

export default function ResumeAIInsights({
  loading,
  loadingMessage,
  ats,
  jobMatch,
  error,
}) {
  if (error) {
    return (
      <div className="resume-ai resume-ai--error">
        <FiAlertCircle aria-hidden="true" />
        <p>{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="resume-ai resume-ai--loading">
        <FiZap className="resume-ai__sparkle" aria-hidden="true" />
        <p>{loadingMessage || 'Recalculating your score with AI…'}</p>
      </div>
    );
  }

  if (!ats && !jobMatch) {
    return null;
  }

  const score = ats?.score ?? 0;
  const matchPercentage = jobMatch?.match_percentage ?? 0;
  const activeTier = getScoreTier(score);

  return (
    <section className="resume-ai" aria-label="AI resume insights">
      <div className="resume-ai__hero">
        <div className="resume-ai__score-main">
          <span className="resume-ai__label">Resume score</span>
          <div className="resume-ai__score-value">
            <strong>{score}</strong>
            <span>%</span>
          </div>
          <div className="resume-ai__tier-bar" aria-hidden="true">
            {SCORE_TIERS.map((tier, index) => (
              <span
                key={tier.label}
                className={`resume-ai__tier-segment${index <= activeTier ? ' resume-ai__tier-segment--filled' : ''}`}
              />
            ))}
          </div>
          <div className="resume-ai__tier-labels">
            {SCORE_TIERS.map((tier) => (
              <span key={tier.label}>{tier.label}</span>
            ))}
          </div>
        </div>

        {jobMatch && (
          <div className="resume-ai__match-block">
            <span className="resume-ai__label">Best job match</span>
            {jobMatch.matched_job && (
              <p className="resume-ai__job-title">
                {jobMatch.matched_job.title}
                <span> · {jobMatch.matched_job.company}</span>
              </p>
            )}
            <div className="resume-ai__progress">
              <div
                className="resume-ai__progress-bar"
                style={{ width: `${matchPercentage}%` }}
              />
            </div>
            <span className="resume-ai__match-value">{matchPercentage}% match</span>
          </div>
        )}
      </div>

      <div className="resume-ai__grid">
        {ats?.missing?.length > 0 && (
          <article className="resume-ai__card resume-ai__card--missing">
            <h4><FiAlertCircle aria-hidden="true" /> Missing</h4>
            <ul>
              {ats.missing.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        )}

        {jobMatch?.missing_skills?.length > 0 && (
          <article className="resume-ai__card resume-ai__card--skills">
            <h4><FiTrendingUp aria-hidden="true" /> Missing skills for top match</h4>
            <div className="resume-ai__tags">
              {jobMatch.missing_skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </article>
        )}

        {ats?.strengths?.length > 0 && (
          <article className="resume-ai__card resume-ai__card--strengths">
            <h4><FiCheckCircle aria-hidden="true" /> Strengths</h4>
            <ul>
              {ats.strengths.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        )}

        {ats?.suggestions?.length > 0 && (
          <article className="resume-ai__card resume-ai__card--suggestions">
            <h4><FiZap aria-hidden="true" /> AI suggestions</h4>
            <ul>
              {ats.suggestions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        )}
      </div>
    </section>
  );
}
