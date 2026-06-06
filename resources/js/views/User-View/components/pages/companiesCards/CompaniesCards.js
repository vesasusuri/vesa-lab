import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaLocationDot, FaUsers } from 'react-icons/fa6';
import { usePlatformAdmin } from "../../../../../context/PlatformAdminContext";
import './companiesCards.scss';

const CompaniesCards = ({ contentSource = 'home' }) => {
    const { data } = usePlatformAdmin();
    const homeContent = data.homeContent || {};
    const companiesContent = data.pageContent?.companies || {};
    const content = contentSource === 'companies' ? companiesContent : homeContent;
    const section = (data.homeSections || []).find((s) => s.key === "companies_cards");

    const companies = useMemo(() => {
        const raw = (section?.items || []).filter((item) => item.isActive !== false);
        return raw.map((item) => ({
            id: item.metadata?.companyId ?? item.id,
            name: item.title || 'Company',
            logo: item.imageUrl,
            employees: item.metadata?.employees || '—',
            location: item.metadata?.location || '—',
            openRoles: item.metadata?.openRoles || '—',
            industry: item.subtitle || '—',
            description: item.description || '',
        }));
    }, [section]);

    return (
        <section className="companies-section" >
            <div className="companies-section-header" data-aos="fade-up">
                <div>
                    <p className="companies-section-eyebrow">{content.heroEyebrow || content.companiesEyebrow || 'Top employers'}</p>
                    <h2 className="companies-section-title">{content.heroTitle || content.featuredTitle || content.companiesTitle || 'Discover companies hiring right now'}</h2>
                    <p className="companies-section-description">
                        {content.heroDescription || content.featuredDescription || content.companiesDescription || 'Explore standout companies, compare team size and location, and find the places where your next role could start.'}
                    </p>
                </div>

                <a href="/companies" className="companies-section-link">
                    {content.primaryCta || content.companiesCta || 'Browse companies'} <FaArrowRight aria-hidden />
                </a>
            </div>

            <div className="companies-grid" data-aos="fade-up">
                {companies.map((company) => (
                    <article key={company.id} className="company-card" >
                        <div className="company-card-top">
                            <div className="company-logo-wrap">
                                <img src={company.logo} alt={`${company.name} logo`} className="company-logo" />
                            </div>

                            <span className="company-industry">{company.industry}</span>
                        </div>

                        <div className="company-card-body">
                            <h3>{company.name}</h3>
                            <p>{company.description}</p>
                        </div>

                        <div className="company-meta">
                            <span>
                                <FaUsers aria-hidden />
                                {company.employees}
                            </span>
                            <span>
                                <FaLocationDot aria-hidden />
                                {company.location}
                            </span>
                        </div>

                        <div className="company-card-footer">
                            <span className="company-open-roles">{company.openRoles}</span>
                            <Link to={`/companies/${company.id}`}>View company</Link>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default CompaniesCards;
