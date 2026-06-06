import React, { useEffect, useState } from 'react';
import './aboutOverview.scss';
import useAboutContent from '../../../../../hooks/useAboutContent';

const DEFAULT_PANELS = [
    { title: 'What BeeHired Solves', description: 'Recruitment is often fragmented across email, spreadsheets, and disconnected tools. BeeHired consolidates announcements, applications, evaluations, and decisions in one secure platform.' },
    { title: 'Why Organizations Use It', description: 'Faster processing, better visibility, and consistent candidate handling. Teams can collaborate efficiently while maintaining professional standards and audit-ready records.' },
];

const AboutOverview = () => {
    const content = useAboutContent();
    const [panels, setPanels] = useState(DEFAULT_PANELS);

    const missionTitle       = content.missionTitle       || 'Built to keep hiring clear, structured, and easy to manage';
    const missionDescription = content.missionDescription || null;
    const overviewEyebrow    = content.overviewEyebrow    || null;

    useEffect(() => {
        fetch('/api/home-page-content')
            .then(r => r.json())
            .then(payload => {
                const section = (payload?.homeSections || []).find(s => s.key === 'about_overview');
                if (section?.items?.length) setPanels(section.items);
            })
            .catch(() => {});
    }, []);

    return (
        <section id="about-story" className="about-overview">
            <div className="about-container">
                <div className="about-overview__intro" data-aos="fade-up">
                    {overviewEyebrow && <span className="about-overview__eyebrow">{overviewEyebrow}</span>}
                    <h2>{missionTitle}</h2>
                </div>

                <div className="about-overview__grid">
                    {panels.map((panel, i) => (
                        <article key={i} className="about-overview__panel" data-aos="fade-up" data-aos-delay={100 + i * 100}>
                            <h3>{panel.title}</h3>
                            <p>{panel.description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutOverview;
