import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import JobDetail from '../../components/pages/JobDetail/JobDetail';
import Navbar from '../../components/shared/navbar/Navbar';
import Footer from '../../components/shared/footer/Footer';
import { getJobListing, listJobListings, mapJobListing } from '../../../../api/jobsApi';
import '../../components/pages/JobDetail/JobDetail.scss';

function jobFromNavigationState(state, id) {
  const preview = state?.job;
  if (!preview || String(preview.id) !== String(id)) {
    return null;
  }
  return preview;
}

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const previewJob = jobFromNavigationState(location.state, id);

  const [job, setJob] = useState(previewJob);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [loading, setLoading] = useState(!previewJob);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const nextPreview = jobFromNavigationState(location.state, id);

    if (nextPreview) {
      setJob(nextPreview);
      setLoading(false);
    } else {
      setJob(null);
      setLoading(true);
    }
    setError('');

    const load = async () => {
      try {
        const [jobRes, listRes] = await Promise.all([
          getJobListing(id),
          listJobListings(),
        ]);

        if (cancelled) return;

        const mapped = mapJobListing(jobRes.job);
        const allJobs = (listRes.jobs || []).map(mapJobListing);
        setJob(mapped);
        setRelatedJobs(
          allJobs
            .filter((j) => {
              if (j.id === mapped.id) return false;
              const sharedType = (mapped.types || []).some((type) => (j.types || []).includes(type));
              return sharedType || j.type === mapped.type;
            })
            .slice(0, 3),
        );
      } catch {
        if (!cancelled) {
          setError('Job not found.');
          if (!nextPreview) {
            setJob(null);
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [id, location.state]);

  if (loading && !job) {
    return (
      <div className="job-detail-page-wrap">
        <Navbar />
        <p className="job-detail-page-loading">Loading job…</p>
        <Footer />
      </div>
    );
  }

  if ((error && !job) || !job) {
    return (
      <div className="job-detail-page-wrap">
        <Navbar />
        <p className="job-detail-page-error">{error || 'Job not found.'}</p>
        <Footer />
      </div>
    );
  }

  return (
    <div className="job-detail-page-wrap">
      <Navbar />
      <JobDetail
        job={job}
        onBack={() => navigate('/jobs')}
        relatedJobs={relatedJobs}
        onSelectJob={(related) => navigate(`/jobs/${related.id}`, { state: { job: related } })}
      />
      <Footer />
    </div>
  );
};

export default JobDetailPage;
