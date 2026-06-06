import React from 'react';
import Navbar from '../../components/shared/navbar/Navbar';
import AboutHero from '../../components/pages/aboutbanner/aboutHero';
import AboutOverview from '../../components/pages/aboutoverview/aboutOverview';
import AboutTeam from '../../components/shared/teams/aboutTeam';
import Footer from '../../components/shared/footer/Footer';
import Results from '../../components/pages/aboutoverview/results';

const About = () => {
    return (
        <div className="about-page">
            <Navbar />
            <AboutHero />
            <AboutOverview />
            <Results/>
            <AboutTeam />
            <Footer />
        </div>
    );
};

export default About;
