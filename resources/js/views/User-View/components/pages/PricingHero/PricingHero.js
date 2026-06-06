import React from 'react';
import './PricingHero.scss';
import usePricingContent from '../../../../../hooks/usePricingContent';

const PricingHero = () => {
  const { hero, loading } = usePricingContent();

  if (loading) return <section className="pricing-hero" />;

  const title = hero.heroTitle       || 'Scale your team, not your costs.';
  const desc  = hero.heroDescription || 'Launch lean, scale as you grow, and keep every hiring decision visible from first application to final offer.';

  return (
    <section className="pricing-hero">
      <div className="pricing-hero__inner pricing-container">
        <h1 data-aos="fade-up">{title}</h1>
        <p data-aos="fade-up">{desc}</p>
      </div>
    </section>
  );
};

export default PricingHero;
