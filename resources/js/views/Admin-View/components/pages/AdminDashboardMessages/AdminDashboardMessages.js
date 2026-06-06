import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FiInbox, FiMail } from 'react-icons/fi';
import '../../shared/AdminShared.scss';

const AdminDashboardMessages = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        axios.get('/api/admin/contact-submissions')
            .then((res) => setSubmissions(res.data.submissions || []))
            .catch(() => setError('Failed to load messages.'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="admin-page">
            <section className="admin-card">
                <div className="admin-card-head">
                    <div>
                        <h2>Contact Messages</h2>
                        <p>Messages submitted through the Contact Us page.</p>
                    </div>
                    <span className="admin-badge">{submissions.length} total</span>
                </div>

                {loading && <p className="admin-empty">Loading…</p>}
                {error && <p className="admin-empty" style={{ color: '#b42318' }}>{error}</p>}

                {!loading && !error && submissions.length === 0 && (
                    <div className="admin-empty-state">
                        <FiInbox />
                        <p>No messages yet.</p>
                    </div>
                )}

                {!loading && submissions.length > 0 && (
                    <div className="admin-messages-list">
                        {submissions.map((s) => (
                            <div
                                key={s.id}
                                className={`admin-message-item ${expanded === s.id ? 'open' : ''}`}
                            >
                                <button
                                    className="admin-message-header"
                                    type="button"
                                    onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                                >
                                    <span className="admin-message-icon"><FiMail /></span>
                                    <span className="admin-message-name">{s.first_name} {s.last_name}</span>
                                    <span className="admin-message-email">{s.email}</span>
                                    <span className="admin-message-date">
                                        {new Date(s.created_at).toLocaleDateString('en-GB', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        })}
                                    </span>
                                </button>

                                {expanded === s.id && (
                                    <div className="admin-message-body">
                                        {s.notes}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
};

export default AdminDashboardMessages;
