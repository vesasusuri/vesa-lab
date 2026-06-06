import React from 'react';
import Navbar from '../../components/shared/navbar/Navbar';
import Footer from '../../components/shared/footer/Footer';
import CompaniesDetails from '../../components/pages/companiesDetails/CompaniesDetails';

const CompaniesDetail = () => {
  return (
    <div className="companies-page">
      <Navbar />
      <CompaniesDetails />
      <Footer />
    </div>
  );
};

export default CompaniesDetail;
