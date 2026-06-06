import React from 'react';
import './aboutHero.scss';
import useAboutContent from '../../../../../hooks/useAboutContent';

const AboutHero = () => {
    const content = useAboutContent();

    const heroTitle     = content.heroTitle     || 'People hire people. BeeHired keeps it fair.';
    const heroDesc      = content.heroDescription || 'From the first announcement to the final shortlist, every step stays visible, structured, and easy for teams to manage together.';
    const primaryCta    = content.primaryCta    || 'Read About BeeHired';
    const heroEyebrow   = content.heroEyebrow   || null;
    const heroBgImage   = content.heroBgImage   || null;

    const wrapStyle = heroBgImage
        ? { backgroundImage: `url("${heroBgImage}")`, backgroundPosition: 'center -250px', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }
        : {};

    return (
        <section className="about-hero" data-aos="fade-up">
            <div className="about-hero__wrap" style={wrapStyle}>
                <div className="about-hero__copy">
                    <h1 data-aos="fade-up">{heroTitle}</h1>
                    <p data-aos="fade-up">{heroDesc}</p>
                    <a className="about-hero__cta" href="#about-story" data-aos="fade-up">
                        {primaryCta} <span>→</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default AboutHero;
