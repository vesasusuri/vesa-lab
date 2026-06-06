import React, { useEffect, useState } from 'react';
import './JobDetail.scss';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../context/AuthContext';
import { applyToJob, getSavedJobIds, saveJob, unsaveJob } from '../../../../../api/jobsApi';

const JobDetail = ({ job, onBack, relatedJobs, onSelectJob }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [applyState, setApplyState] = useState('idle');
  const [saved, setSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const descriptionParagraphs = job.descriptionParagraphs?.length
    ? job.descriptionParagraphs
    : (job.description ? [job.description] : []);

  const benefitLines = job.benefitLines?.length
    ? job.benefitLines
    : [];

  const requirementItems = job.tags?.length ? job.tags : [];

  useEffect(() => {
    if (!user || !job?.id) return;

    getSavedJobIds()
      .then((ids) => setSaved(ids.includes(job.id)))
      .catch(() => {});
  }, [user, job?.id]);

  const handleApply = async () => {
    if (!user) { navigate('/login'); return; }
    if (applyState === 'applied' || applyState === 'already' || applyState === 'loading') return;

    setApplyState('loading');
    try {
      await applyToJob(job.id);
      setApplyState('applied');
    } catch (err) {
      const status = err?.response?.status;
      if (status === 422 || status === 409) {
        setApplyState('already');
      } else {
        setApplyState('error');
        setTimeout(() => setApplyState('idle'), 3000);
      }
    }
  };

  const handleSave = async () => {
    if (!user) { navigate('/login'); return; }
    if (saveLoading) return;

    setSaveLoading(true);
    try {
      if (saved) {
        await unsaveJob(job.id);
        setSaved(false);
      } else {
        await saveJob(job.id);
        setSaved(true);
      }
    } catch {
      
    } finally {
      setSaveLoading(false);
    }
  };

  const applyLabel = () => {
    if (applyState === 'loading')  return 'Applying…';
    if (applyState === 'applied')  return '✓ Applied';
    if (applyState === 'already')  return '✓ Already Applied';
    if (applyState === 'error')    return 'Failed – Try Again';
    return '↗ Apply Now';
  };

  const saveLabel = () => {
    if (saveLoading) return saved ? 'Unsaving…' : 'Saving…';
    return saved ? '✓ Saved' : 'Save Job';
  };

  return (
    <div className="job-detail-page">

      <button className="back-btn" onClick={onBack}>
        ← Back to Jobs
      </button>

      <div className="job-detail-header" data-aos="fade-up">
        <div className="job-detail-initials">{job.initials}</div>
        <div className="job-detail-title">
          <h1>{job.title}</h1>
          <p>{job.company}</p>
        </div>
        {job.featured && (
          <div className="job-detail-featured">☆ Featured</div>
        )}
      </div>

      <div className="job-detail-meta" data-aos="fade-up" data-aos-delay="100">
        <span>Location: {job.location}</span>
        <span>Type: {(job.types?.length ? job.types : [job.type]).join(', ')}</span>
        <span>Salary: {job.salary}</span>
        <span>Posted: {job.time}</span>
      </div>

      {job.tags?.length > 0 && (
        <div className="job-detail-tags" data-aos="fade-up" data-aos-delay="150">
          {job.tags.map((tag) => (
            <div key={tag} className="job-detail-tag">{tag}</div>
          ))}
        </div>
      )}

      {descriptionParagraphs.length > 0 && (
        <>
          <h2 data-aos="fade-up">About the Role</h2>
          {descriptionParagraphs.map((paragraph) => (
            <p key={paragraph} data-aos="fade-up">{paragraph}</p>
          ))}
        </>
      )}

      {requirementItems.length > 0 && (
        <>
          <h2 data-aos="fade-up">Requirements</h2>
          <ul data-aos="fade-up">
            {requirementItems.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </>
      )}

      {benefitLines.length > 0 && (
        <>
          <h2 data-aos="fade-up">What We Offer</h2>
          <ul data-aos="fade-up">
            {benefitLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </>
      )}

      <div className="job-detail-actions" data-aos="fade-up">
        <button
          className={`apply-btn${applyState === 'applied' || applyState === 'already' ? ' is-applied' : applyState === 'error' ? ' is-error' : ''}`}
          onClick={handleApply}
          disabled={applyState === 'loading' || applyState === 'applied' || applyState === 'already'}
        >
          {applyLabel()}
        </button>
        <button
          className={`save-btn${saved ? ' saved' : ''}`}
          onClick={handleSave}
          disabled={saveLoading}
        >
          {saveLabel()}
        </button>
      </div>

      {relatedJobs.length > 0 && (
        <div className="job-detail-related" data-aos="fade-up">
          <h2>More Jobs</h2>
          <div className="related-cards">
            {relatedJobs.map((related, index) => (
              <div
                key={related.id}
                className="related-card"
                onClick={() => onSelectJob(related)}
                style={{ cursor: 'pointer' }}
                data-aos="fade-up"
                data-aos-delay={index * 80}
              >
                {related.featured && (
                  <div className="related-featured">☆ Featured</div>
                )}
                <div className="related-initials">{related.initials}</div>
                <h3>{related.title}</h3>
                <p>{related.company}</p>
                <span>{related.location}</span>
                <span>{related.salary}</span>
                <span>{related.time}</span>
                {related.tags?.length > 0 && (
                  <div className="related-tags">
                    {related.tags.map((tag) => (
                      <div key={tag} className="related-tag">{tag}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default JobDetail;
