import React from 'react';
import CompaniesCards from '../../components/pages/companiesCards/CompaniesCards';
import Footer from '../../components/shared/footer/Footer';
import Navbar from '../../components/shared/navbar/Navbar';
import CompaniesReview from '../../components/pages/companiesReview/CompaniesReview';

const Companies = () => {
    return (
        <div className="companies-page">
            <Navbar />
            <CompaniesCards contentSource="companies" />
            <CompaniesReview/>
            <Footer />
        </div>
    );
};

export default Companies;
