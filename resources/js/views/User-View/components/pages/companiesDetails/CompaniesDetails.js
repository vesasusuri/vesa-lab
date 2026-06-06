import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaLocationDot, FaUsers } from 'react-icons/fa6';
import './CompaniesDetails.scss';
import CompaniesForm from '../companiesForm/CompaniesForm';
import CompaniesReview from '../companiesReview/CompaniesReview';
import { usePlatformAdmin } from '../../../../../context/PlatformAdminContext';

const CompaniesDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = usePlatformAdmin();
  const section = (data.homeSections || []).find((s) => s.key === 'companies_cards');

  const company = (section?.items || [])
    .filter((item) => item.isActive !== false)
    .map((item) => ({
      id: item.metadata?.companyId ?? item.id,
      name: item.title || 'Company',
      logo: item.imageUrl,
      location: item.metadata?.location || '—',
      employees: item.metadata?.employees || '—',
      history: item.metadata?.history || item.description || '',
      intro: item.metadata?.detailIntro || 'Learn about the company story and read feedback shared by people who have worked there.',
      reviews: Array.isArray(item.metadata?.reviews) ? item.metadata.reviews : [],
    }))
    .find((item) => String(item.id) === String(id));
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    setReviews(company?.reviews ?? []);
  }, [company]);

  const handleAddReview = (review) => {
    setReviews((currentReviews) => [review, ...currentReviews]);
  };

  if (!company) {
    return (
      <section className="company-details not-found">
        <div className="company-details-container">
          <h2>Company not found</h2>
          <p>We could not find the company details you requested.</p>
          <button type="button" onClick={() => navigate('/companies')}>
            Back to Companies
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="company-details">
        <div className="company-details-container">
          <div className="company-details-hero">
            <div className="company-details-hero-main">
              <div className="company-details-logo-wrap" data-aos="fade-up">
                <img src={company.logo} alt={`${company.name} logo`} />
              </div>
              <div className="company-details-hero-content">

                <p className="company-details-intro" data-aos="fade-up">
                  {company.intro}
                </p>

                <div className="company-details-meta" data-aos="fade-up">
                  <span data-aos="fade-up">
                    <FaUsers aria-hidden />
                    {company.employees}
                  </span>
                  <span data-aos="fade-up">
                    <FaLocationDot aria-hidden />
                    {company.location}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <article className="company-history">
            <h2 data-aos="fade-up">Company History</h2>
            <p data-aos="fade-up">{company.history}</p>
          </article>

          <CompaniesReview reviews={reviews} />
          <CompaniesForm companyName={company.name} onAddReview={handleAddReview} />
        </div>
    </section>
  );
};

export default CompaniesDetails;
