import React, { useEffect, useState } from 'react';
import { FiCalendar, FiCheckCircle, FiClipboard, FiInbox } from 'react-icons/fi';
import { fetchHrOverviewStats } from '../../../../../api/hrApi';
import './HireDashboardStats.scss';

const ICON_MAP = { FiClipboard, FiInbox, FiCalendar, FiCheckCircle };

const ACTIONS = {
    postings:     'listings',
    applications: 'all',
    interviews:   'interviews',
    hires:        'hires',
};

const HireDashboardStats = ({ setActiveTab }) => {
    const [stats,   setStats]   = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHrOverviewStats()
            .then(setStats)
            .catch(() => setStats([]))
            .finally(() => setLoading(false));
    }, []);

    const handleClick = (id) => {
        const action = ACTIONS[id];
        if (action === 'listings') {
            document.getElementById('hire-listings-anchor')?.scrollIntoView({ behavior: 'smooth' });
        } else if (action === 'all') {
            setActiveTab?.('All');
            document.getElementById('hire-applications-anchor')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const displayStats = loading
        ? [
            { id: 'postings',     label: 'Active Postings',    value: '—', sub: 'Loading…', icon: 'FiClipboard'   },
            { id: 'applications', label: 'Applications',        value: '—', sub: 'Loading…', icon: 'FiInbox'       },
            { id: 'interviews',   label: 'Interviews Set',      value: '—', sub: 'Loading…', icon: 'FiCalendar'    },
            { id: 'hires',        label: 'Hires This Month',    value: '—', sub: 'Loading…', icon: 'FiCheckCircle' },
          ]
        : (stats ?? []);

    return (
        <section className="hire-dashboard-stats-section">
            <div className="hire-stats-wrapper">
                {displayStats.map((s) => {
                    const Icon = ICON_MAP[s.icon] || FiClipboard;
                    return (
                        <div
                            key={s.id}
                            className="hire-stat-card"
                            onClick={() => handleClick(s.id)}
                            style={{ cursor: ACTIONS[s.id] ? 'pointer' : 'default' }}
                        >
                            <div className="hire-stat-icon">
                                <Icon color="#ffffff" size={22} />
                            </div>
                            <div className="hire-stat-info">
                                <div className="hire-stat-value">{s.value}</div>
                                <div className="hire-stat-label">{s.label}</div>
                                <div className="hire-stat-sub">{s.sub}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default HireDashboardStats;
