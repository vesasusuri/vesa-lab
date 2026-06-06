import React from 'react';
import Footer from '../../components/shared/footer/Footer';
import Navbar from '../../components/shared/navbar/Navbar';
import ContactBanner from '../../components/pages/contactBanner/ContactBanner';
import ContactForm from '../../components/shared/ContactForm/ContactForm';

const Companies = () => {
    return (
        <div className="companies-page">
            <Navbar />
            <ContactBanner />
            <ContactForm/>
            <Footer />
        </div>
    );
};

export default Companies;
