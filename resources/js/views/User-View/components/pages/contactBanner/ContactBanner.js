import React from 'react';
import { usePlatformAdmin } from '../../../../../context/PlatformAdminContext';
import './ContactBanner.scss';

function ContactBanner() {
    const { data } = usePlatformAdmin();
    const contactContent = data.pageContent?.contact || {};

    return (
        <div className="contact-page">
            <section className="contact-hero">
                <div className="contact-container contact-hero__inner">
                    <p className="contact-eyebrow">
                        {contactContent.heroEyebrow || 'Contact Us'}
                    </p>
                    <h1>
                        {contactContent.heroTitle || 'Build the next hire with clarity.'}
                    </h1>
                    <p className="contact-hero__copy">
                        {contactContent.heroDescription || 'Reach out for hiring support, partnership questions, or product help.'}
                    </p>
                </div>
            </section>
        </div>
    );
}

export default ContactBanner;
