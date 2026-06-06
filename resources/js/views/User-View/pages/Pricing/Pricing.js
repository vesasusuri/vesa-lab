import React from 'react';
import Navbar from '../../components/shared/navbar/Navbar';
import PricingHero from '../../components/pages/PricingHero/PricingHero';
import PricingPlans from '../../components/pages/PricingPlans/PricingPlans';
import Footer from '../../components/shared/footer/Footer';

const Pricing = () => {
  return (
    <div className="pricing-page">
      <Navbar />
      <PricingHero />
      <PricingPlans />
      <Footer />
    </div>
  );
};

export default Pricing;
