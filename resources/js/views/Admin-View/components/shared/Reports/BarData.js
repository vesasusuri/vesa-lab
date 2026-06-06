import React from 'react';
import './scss/AdminDashboardReports.scss';

const barData = [
    { month: 'Dec', apps: 320 },
    { month: 'Jan', apps: 410 },
    { month: 'Feb', apps: 390 },
    { month: 'Mar', apps: 520 },
    { month: 'Apr', apps: 680 },
    { month: 'May', apps: 760 },
];

const maxBar = Math.max(...barData.map((item) => item.apps));

const BarData = () => (
    <main className="admin-page">
        <div className="rep-grid">
            <div className="admin-card rep-chart-card">
                <div className="rep-card-head">
                    <span className="rep-card-title">Applications Over Time</span>
                    <span className="rep-card-sub">Last 6 months</span>
                </div>
                <div className="rep-bar-chart">
                    {barData.map((item) => (
                        <div className="rep-bar-col" key={item.month}>
                            <span className="rep-bar-val">{item.apps}</span>
                            <div className="rep-bar-track">
                                <div className="rep-bar-fill" style={{ height: `${(item.apps / maxBar) * 100}%` }} />
                            </div>
                            <span className="rep-bar-label">{item.month}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </main>
);

export default BarData;
