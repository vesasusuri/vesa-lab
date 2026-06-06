import React, { useEffect, useState } from 'react';
import { FiDownload, FiSearch } from 'react-icons/fi';
import { fetchActivityLogs } from '../../../../../api/adminApi';
import '../../shared/AdminShared.scss';

const AdminDashboardLogs = () => {
    const [logs, setLogs]   = useState({ data: [], meta: {} });
    const [page, setPage]   = useState(1);
    const [search, setSearch] = useState('');
    const [loading, setLoad]  = useState(true);

    useEffect(() => {
        setLoad(true);
        fetchActivityLogs({ page, search: search || undefined })
            .then((d) => setLogs(d.logs))
            .catch(() => {})
            .finally(() => setLoad(false));
    }, [page, search]);

    const entries = logs.data ?? [];
    const meta    = logs.meta ?? {};

    const fmt = (iso) => iso
        ? new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        : '—';

    const exportLogs = () => {
        const rows = entries.map((l) => ({
            id: l.id, action: l.action, description: l.description,
            user: l.user?.email ?? '—', ip: l.ip ?? '—', created_at: l.created_at,
        }));
        const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
        const url  = URL.createObjectURL(blob);
        const a    = Object.assign(document.createElement('a'), { href: url, download: 'activity-logs.json' });
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <main className="admin-page">
            <section className="admin-card">
                <div className="admin-card-head">
                    <div>
                        <h2>Activity Logs</h2>
                        <p>All platform events stored in the database.</p>
                    </div>
                    <button className="admin-btn admin-btn-light" type="button" onClick={exportLogs}>
                        <FiDownload /> Export
                    </button>
                </div>
                <div className="admin-field" style={{ marginTop: 4 }}>
                    <div className="admin-input-with-icon">
                        <FiSearch />
                        <input
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Search action, description, or IP…"
                        />
                    </div>
                </div>
            </section>

            <section className="admin-card">
                <div className="admin-card-head">
                    <div>
                        <h2>Events</h2>
                        <p>{loading ? 'Loading…' : `${meta.total ?? entries.length} total events`}</p>
                    </div>
                </div>

                {entries.length === 0 && !loading ? (
                    <p style={{ textAlign: 'center', color: '#b0a89e', padding: '40px 0', margin: 0 }}>
                        No activity logs yet.
                    </p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Action</th>
                                    <th>Description</th>
                                    <th>User</th>
                                    <th>IP</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entries.map((log) => (
                                    <tr key={log.id}>
                                        <td>
                                            <code style={{ fontSize: 12, background: '#f5f4f0', padding: '2px 6px', borderRadius: 6 }}>
                                                {log.action}
                                            </code>
                                        </td>
                                        <td style={{ color: '#6f685d', maxWidth: 300 }}>{log.description ?? '—'}</td>
                                        <td style={{ color: '#6f685d', fontSize: 13 }}>
                                            {log.user ? (
                                                <><strong>{log.user.name}</strong><br /><span>{log.user.email}</span></>
                                            ) : '—'}
                                        </td>
                                        <td style={{ color: '#9d9590', fontSize: 12, fontFamily: 'monospace' }}>{log.ip ?? '—'}</td>
                                        <td style={{ color: '#9d9590', fontSize: 13, whiteSpace: 'nowrap' }}>{fmt(log.created_at)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {meta.last_page > 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 20, paddingTop: 16, borderTop: '1px solid #f2efe9', fontSize: 13, color: '#7a746d' }}>
                        <button className="admin-btn admin-btn-light" onClick={() => setPage((p) => p - 1)} disabled={page <= 1}>← Prev</button>
                        <span>Page {meta.current_page} of {meta.last_page}</span>
                        <button className="admin-btn admin-btn-light" onClick={() => setPage((p) => p + 1)} disabled={page >= meta.last_page}>Next →</button>
                    </div>
                )}
            </section>
        </main>
    );
};

export default AdminDashboardLogs;
