import React, { useEffect, useState } from 'react'
import useAboutContent from '../../../../../hooks/useAboutContent';
import './results.scss'
import CountUp from "react-countup";
import VisibilitySensor from "react-visibility-sensor";

const DEFAULT_STATS = [
    { title: '2500', subtitle: 'Applications Processed' },
    { title: '340',  subtitle: 'Positions Published' },
    { title: '120',  subtitle: 'Companies' },
    { title: '345',  subtitle: 'Employed Students' },
];

const Results = () => {
    const [viewPortEntered, setViewPortEntered] = useState(false);
    const [stats, setStats] = useState(DEFAULT_STATS);
    const [sectionTitle, setSectionTitle] = useState(null);
    const content = useAboutContent();

    useEffect(() => {
        fetch('/api/home-page-content')
            .then(r => r.json())
            .then(payload => {
                const section = (payload?.homeSections || []).find(s => s.key === 'about_stats');
                if (section) {
                    if (section.title) setSectionTitle(section.title);
                    if (section.items?.length) setStats(section.items);
                }
            })
            .catch(() => {});
    }, []);

    const statsTitle = sectionTitle || content.statsTitle || 'Our Work';

    return (
        <div className='shared-results-numbers'>
            <h1 data-aos="fade-up" data-aos-anchor-placement="top-bottom">{statsTitle}</h1>
            <div className="numbers">
                {stats.map((stat, i) => (
                    <div className="number" key={i}>
                        <div className="nr-container">
                            <div className="circle"></div>
                            <div className="nr">
                                <CountUp end={parseInt(stat.title) || 0} duration={1.75} useEasing={true} start={viewPortEntered ? null : 10}>
                                    {({ countUpRef }) => (
                                        <VisibilitySensor
                                            active={!viewPortEntered}
                                            onChange={isVisible => { if (isVisible) setViewPortEntered(true); }}
                                            delayedCall
                                        >
                                            <span ref={countUpRef}></span>
                                        </VisibilitySensor>
                                    )}
                                </CountUp>+
                            </div>
                        </div>
                        <p>{stat.subtitle}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Results