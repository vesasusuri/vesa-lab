import React, { useEffect, useState } from 'react';
import { FiBriefcase, FiCheckCircle, FiUsers, FiActivity } from 'react-icons/fi';
import { fetchAdminStats } from '../../../../../api/adminApi';
import '../../shared/AdminShared.scss';

const AdminDashboardOverview = () => {
    const [stats, setStats]   = useState(null);
    const [loading, setLoad]  = useState(true);

    useEffect(() => {
        fetchAdminStats()
            .then(setStats)
            .catch(() => {})
            .finally(() => setLoad(false));
    }, []);

    const val = (key) => loading ? '—' : (stats?.[key] ?? '—');

    const cards = [
        { label: 'Total users',       value: val('total_users'),        icon: FiUsers      },
        { label: 'Active HR accounts',value: val('active_hr'),          icon: FiBriefcase  },
        { label: 'Active job listings',value: val('active_jobs'),       icon: FiActivity   },
        { label: 'Total hired',       value: val('total_hired'),        icon: FiCheckCircle},
    ];

    const secondRow = [
        { label: 'HR users total',        value: val('hr_users')          },
        { label: 'Pending HR activations',value: val('pending_hr')        },
        { label: 'Total applications',    value: val('total_applications') },
        { label: 'Total job listings',    value: val('total_jobs')        },
    ];

    return (
        <main className="admin-page">
            <section className="admin-card">
                <div className="admin-card-head">
                    <div>
                        <h2>Platform Overview</h2>
                        <p>Live statistics pulled from the database.</p>
                    </div>
                </div>
                <div className="admin-kpi-grid">
                    {cards.map(({ label, value, icon: Icon }) => (
                        <article className="admin-kpi" key={label}>
                            <span className="admin-icon-badge"><Icon /></span>
                            <strong>{value}</strong>
                            <span>{label}</span>
                        </article>
                    ))}
                </div>
            </section>

            <section className="admin-card">
                <div className="admin-card-head">
                    <div><h2>Detailed Counts</h2></div>
                </div>
                <table className="admin-table">
                    <thead>
                        <tr><th>Metric</th><th>Value</th></tr>
                    </thead>
                    <tbody>
                        {secondRow.map(({ label, value }) => (
                            <tr key={label}>
                                <td>{label}</td>
                                <td><strong>{value}</strong></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </main>
    );
};

export default AdminDashboardOverview;
