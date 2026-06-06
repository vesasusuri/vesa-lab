import React from 'react';
import { FormattedMessage } from 'react-intl';
import { usePlatformAdmin } from '../../../../../context/PlatformAdminContext';
import { getFooterSocialIcon } from '../../../../../utils/footerSocialIcons';
import { FooterData, SocialMedia } from './data';
import './footer.scss'

const Footer = () => {
    const { data } = usePlatformAdmin();
    const section = (data.homeSections || []).find((s) => s.key === "footer");
    const config = section?.items?.[0]?.metadata;

    if (config && config.brand) {
        const { brand, social = [], columns = [], copyright } = config;
        return (
            <div className='shared-footer'>
                <div className="main-row">
                    <div className="first-col">
                        <div className="top">
                            <a href='/' className='logo-container'>
                                <div className="logo"></div>
                            </a>
                            <h5>{brand.tagline || 'Find the best job for you.'}</h5>
                            <p><span className="footer-label">PHONE</span>: {brand.phone || ''}</p>
                            <p><span className="footer-label">EMAIL</span>: {brand.email || ''}</p>
                        </div>
                        <div className="links1">
                            {social.map((row, index) => {
                                const Icon = getFooterSocialIcon(row.iconKey);
                                return (
                                    <a
                                        key={`${row.url}-${index}`}
                                        href={row.url || '/'}
                                        aria-label={row.label || `Social link ${index + 1}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <Icon />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    <div className='all-footer-links'>
                        {(columns || []).map((col, categoryIndex) => (
                            <div className="footer-list" key={`footer-category-${categoryIndex}`}>
                                <h6>{col.category}</h6>
                                <div className="links">
                                    {(col.links || []).map((l, linkIndex) => (
                                        <a
                                            key={`${l.href}-${linkIndex}`}
                                            href={l.href || '/'}
                                            className="footer-item"
                                        >
                                            {l.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="last-row">
                    <p>{copyright || '© 2026 BEE HIRED  | ALL RIGHTS RESERVED'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className='shared-footer'>

            <div className="main-row">

                <div className="first-col">
                    <div className="top">
                        <a href='/' className='logo-container'>
                            <div className="logo"></div>
                        </a>
                        <h5><FormattedMessage id='footer-paragraph1' defaultMessage='Find the best job for you.' /></h5>
                        <p><FormattedMessage id='PHONE' defaultMessage='PHONE' />: +383 48 777 888</p>
                        <p><FormattedMessage id='EMAIL' defaultMessage='EMAIL' />:  beehired@gmail.com</p>
                    </div>
                    <div className="links1">
                        {SocialMedia.map((props, index) => {
                            return(
                                <a
                                    key={`${props.to}-${index}`}
                                    href={props.to}
                                    aria-label={`Social link ${index + 1}`}
                                >
                                    {props.icon}
                                </a>
                            )
                        })}
                    </div>
                </div>
                
                <div className='all-footer-links'>
                    {FooterData.map((props, categoryIndex) => {
                        return(
                            <div className="footer-list" key={`footer-category-${categoryIndex}`}>
                                <h6>{props.category}</h6>
                                <div className="links">
                                    {props.links.map((l, linkIndex) => {
                                        return (
                                            <a
                                                key={`${l.to}-${linkIndex}`}
                                                href={l.to}
                                                className="footer-item"
                                            >
                                                {l.link}
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="last-row">

                <p><FormattedMessage id='footer-paragraph2' defaultMessage='© 2026 BEE HIRED  | ALL RIGHTS RESERVED' /></p>
            </div>
        </div>
    )
};

export default Footer;
