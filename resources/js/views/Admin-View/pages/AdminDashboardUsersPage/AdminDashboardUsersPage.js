import React, { useCallback, useEffect, useState } from 'react';
import { FiBriefcase, FiEdit2, FiMail, FiMoreVertical, FiPlus, FiRefreshCw, FiSearch, FiSlash, FiUnlock, FiUser } from 'react-icons/fi';
import {
    createHrUser,
    deactivateHrUser,
    fetchHrUsers,
    reactivateHrUser,
    resetHrUserPassword,
    updateHrUser,
} from '../../../../api/adminApi';
import '../../components/shared/AdminShared.scss';
import './AdminDashboardUsersPage.scss';

const STATUS_META = {
    active:             { label: 'Active',             bg: '#d1fae5', color: '#065f46' },
    pending_activation: { label: 'Pending', bg: '#fef3c7', color: '#92400e' },
    suspended:          { label: 'Suspended',          bg: '#fee2e2', color: '#991b1b' },
};

function StatusBadge({ status }) {
    const meta = STATUS_META[status] ?? { label: status, bg: '#f3f4f6', color: '#374151' };
    return (
        <span className="au-status-badge" style={{ background: meta.bg, color: meta.color }}>
            {meta.label}
        </span>
    );
}

function InviteModal({ onClose, onCreated }) {
    const [form, setForm]    = useState({ name: '', email: '', company: '' });
    const [loading, setLoad] = useState(false);
    const [error, setError]  = useState('');

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoad(true);
        try {
            const data = await createHrUser(form);
            onCreated(data.hr_user);
            onClose();
        } catch (err) {
            const errData = err.response?.data;
            if (errData?.errors) {
                setError(Object.values(errData.errors).flat().join(' '));
            } else {
                setError(errData?.message || 'Could not create HR user.');
            }
        } finally {
            setLoad(false);
        }
    };

    return (
        <div className="au-overlay" onClick={onClose}>
            <div className="au-modal" onClick={(e) => e.stopPropagation()}>
                <div className="au-modal-head">
                    <div>
                        <h2>Invite HR User</h2>
                        <p>An invitation email with a temporary password will be sent automatically.</p>
                    </div>
                    <button className="au-modal-close" onClick={onClose}>✕</button>
                </div>

                {error && <div className="au-alert au-alert-error">{error}</div>}

                <form className="au-form" onSubmit={handleSubmit}>
                    <div className="admin-field">
                        <label>Full Name <span className="au-required">*</span></label>
                        <input value={form.name} onChange={set('name')} placeholder="Jane Smith" required autoFocus />
                    </div>
                    <div className="admin-field">
                        <label>Email Address <span className="au-required">*</span></label>
                        <input type="email" value={form.email} onChange={set('email')} placeholder="jane@company.com" required />
                    </div>
                    <div className="admin-field">
                        <label>Company</label>
                        <input value={form.company} onChange={set('company')} placeholder="Acme Corp (optional)" />
                    </div>
                    <div className="au-modal-actions">
                        <button type="button" className="admin-btn admin-btn-light" onClick={onClose}>Cancel</button>
                        <button type="submit" className="admin-btn admin-btn-accent" disabled={loading}>
                            {loading ? 'Sending invite…' : <><FiMail /> Send Invitation</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function EditModal({ user, onClose, onUpdated }) {
    const [form, setForm]    = useState({ name: user.name, company: user.company ?? '' });
    const [loading, setLoad] = useState(false);
    const [error, setError]  = useState('');

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoad(true);
        try {
            const data = await updateHrUser(user.id, form);
            onUpdated(data.hr_user);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Could not update user.');
        } finally {
            setLoad(false);
        }
    };

    return (
        <div className="au-overlay" onClick={onClose}>
            <div className="au-modal" onClick={(e) => e.stopPropagation()}>
                <div className="au-modal-head">
                    <div>
                        <h2>Edit HR User</h2>
                        <p>{user.email}</p>
                    </div>
                    <button className="au-modal-close" onClick={onClose}>✕</button>
                </div>

                {error && <div className="au-alert au-alert-error">{error}</div>}

                <form className="au-form" onSubmit={handleSubmit}>
                    <div className="admin-field">
                        <label>Full Name <span className="au-required">*</span></label>
                        <input value={form.name} onChange={set('name')} required autoFocus />
                    </div>
                    <div className="admin-field">
                        <label>Company</label>
                        <input value={form.company} onChange={set('company')} />
                    </div>
                    <div className="au-modal-actions">
                        <button type="button" className="admin-btn admin-btn-light" onClick={onClose}>Cancel</button>
                        <button type="submit" className="admin-btn admin-btn-accent" disabled={loading}>
                            {loading ? 'Saving…' : 'Save changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const AdminDashboardUsersPage = () => {
    const [hrUsers, setHrUsers]       = useState({ data: [], meta: {} });
    const [page, setPage]             = useState(1);
    const [search, setSearch]         = useState('');
    const [statusFilter, setStatus]   = useState('');
    const [loading, setLoading]       = useState(true);
    const [showInvite, setShowInvite] = useState(false);
    const [editTarget, setEdit]       = useState(null);
    const [actionLoad, setActLoad]    = useState({});
    const [openMenu, setOpenMenu]     = useState(null);
    const [toast, setToast]           = useState('');

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3500);
    };

    const loadUsers = useCallback(() => {
        setLoading(true);
        fetchHrUsers({ page, search: search || undefined, status: statusFilter || undefined })
            .then((d) => setHrUsers(d.hr_users))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [page, search, statusFilter]);

    useEffect(() => { loadUsers(); }, [loadUsers]);

    useEffect(() => {
        if (!openMenu) return;
        const handler = () => setOpenMenu(null);
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [openMenu]);

    const setActFor = (id, val) => setActLoad((p) => ({ ...p, [id]: val }));

    const handleDeactivate = async (user) => {
        setActFor(user.id, true);
        try {
            const d = await deactivateHrUser(user.id);
            setHrUsers((p) => ({ ...p, data: p.data.map((u) => u.id === user.id ? d.hr_user : u) }));
            showToast(`${user.name} has been suspended.`);
        } catch { showToast('Action failed.'); }
        finally { setActFor(user.id, false); setOpenMenu(null); }
    };

    const handleReactivate = async (user) => {
        setActFor(user.id, true);
        try {
            const d = await reactivateHrUser(user.id);
            setHrUsers((p) => ({ ...p, data: p.data.map((u) => u.id === user.id ? d.hr_user : u) }));
            showToast(`${user.name} has been reactivated.`);
        } catch { showToast('Action failed.'); }
        finally { setActFor(user.id, false); setOpenMenu(null); }
    };

    const handleResetPassword = async (user) => {
        if (!window.confirm(`Reset password for ${user.name}?\n\nA new temporary password will be emailed to ${user.email}.`)) return;
        setActFor(user.id, true);
        try {
            await resetHrUserPassword(user.id);
            loadUsers();
            showToast(`Password reset. Email sent to ${user.email}.`);
        } catch { showToast('Action failed.'); }
        finally { setActFor(user.id, false); setOpenMenu(null); }
    };

    const users = hrUsers.data ?? [];
    const totalHrUsers = hrUsers.total ?? users.length;
    const currentPage = hrUsers.current_page ?? 1;
    const lastPage = hrUsers.last_page ?? 1;

    const fmt = (iso) => iso
        ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '—';

    return (
        <main className="admin-page">

            {toast && <div className="au-toast">{toast}</div>}

            {showInvite && (
                <InviteModal
                    onClose={() => setShowInvite(false)}
                    onCreated={(u) => { loadUsers(); showToast(`Invitation sent to ${u.email}.`); }}
                />
            )}
            {editTarget && (
                <EditModal
                    user={editTarget}
                    onClose={() => setEdit(null)}
                    onUpdated={(updated) => {
                        setHrUsers((p) => ({ ...p, data: p.data.map((u) => u.id === updated.id ? updated : u) }));
                        showToast('User updated.');
                    }}
                />
            )}

            {}
            <section className="admin-card">
                <div className="admin-card-head">
                    <div>
                        <h2>HR User Management</h2>
                        <p>Invite, manage, and monitor all HR accounts on the platform.</p>
                    </div>
                    <button className="admin-btn admin-btn-accent" onClick={() => setShowInvite(true)}>
                        <FiPlus /> Invite HR User
                    </button>
                </div>

                <div className="au-stat-row">
                    {[
                        { label: 'Total HR users',    value: totalHrUsers,                                             Icon: FiUser       },
                        { label: 'Active',            value: users.filter((u) => u.account_status === 'active').length,     Icon: FiBriefcase, c: '#065f46', bg: '#d1fae5' },
                        { label: 'Pending activation',value: users.filter((u) => u.account_status === 'pending_activation').length, Icon: FiMail, c: '#92400e', bg: '#fef3c7' },
                        { label: 'Suspended',         value: users.filter((u) => u.account_status === 'suspended').length,  Icon: FiSlash,     c: '#991b1b', bg: '#fee2e2' },
                    ].map(({ label, value, Icon, c, bg }) => (
                        <div key={label} className="au-stat-chip" style={bg ? { background: bg } : {}}>
                            <Icon style={c ? { color: c } : {}} />
                            <strong style={c ? { color: c } : {}}>{value}</strong>
                            <span style={c ? { color: c } : {}}>{label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {}
            <section className="admin-card admin-card--table">
                <div className="au-toolbar">
                    <div className="admin-input-with-icon">
                        <FiSearch />
                        <input
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Search by name, email, or company…"
                        />
                    </div>
                    <select className="au-select" value={statusFilter} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
                        <option value="">All statuses</option>
                        <option value="active">Active</option>
                        <option value="pending_activation">Pending Activation</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>

                {loading ? (
                    <p className="au-empty">Loading…</p>
                ) : users.length === 0 ? (
                    <p className="au-empty">No HR users found. Click "Invite HR User" to get started.</p>
                ) : (
                    <div className="au-table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Company</th>
                                    <th>Status</th>
                                    <th>Last Login</th>
                                    <th>Invited</th>
                                    <th style={{ width: 48 }} />
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => {
                                    const menuOpensUp = index >= users.length - 2;

                                    return (
                                    <tr key={user.id}>
                                        <td><strong>{user.name}</strong></td>
                                        <td className="au-muted au-cell-email">{user.email}</td>
                                        <td className="au-cell-company">{user.company ?? '—'}</td>
                                        <td><StatusBadge status={user.account_status} /></td>
                                        <td className="au-muted au-cell-date">{fmt(user.last_login_at)}</td>
                                        <td className="au-muted au-cell-date">{fmt(user.created_at)}</td>
                                        <td className="au-actions-cell">
                                            <button
                                                type="button"
                                                className="au-menu-btn"
                                                onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === user.id ? null : user.id); }}
                                                disabled={actionLoad[user.id]}
                                                aria-label={`Actions for ${user.name}`}
                                                aria-expanded={openMenu === user.id}
                                            >
                                                <FiMoreVertical />
                                            </button>
                                            {openMenu === user.id && (
                                                <div
                                                    className={`au-dropdown${menuOpensUp ? ' au-dropdown--up' : ''}`}
                                                    onMouseDown={(e) => e.stopPropagation()}
                                                >
                                                    <button onClick={() => { setEdit(user); setOpenMenu(null); }}>
                                                        <FiEdit2 /> Edit
                                                    </button>
                                                    <button onClick={() => handleResetPassword(user)}>
                                                        <FiRefreshCw /> Reset Password
                                                    </button>
                                                    <div className="au-dropdown-divider" />
                                                    {user.account_status !== 'suspended' ? (
                                                        <button className="au-danger" onClick={() => handleDeactivate(user)}>
                                                            <FiSlash /> Suspend Account
                                                        </button>
                                                    ) : (
                                                        <button onClick={() => handleReactivate(user)}>
                                                            <FiUnlock /> Reactivate Account
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {lastPage > 1 && (
                    <div className="au-pagination">
                        <button className="admin-btn admin-btn-light" onClick={() => setPage((p) => p - 1)} disabled={page <= 1}>← Prev</button>
                        <span>Page {currentPage} of {lastPage}</span>
                        <button className="admin-btn admin-btn-light" onClick={() => setPage((p) => p + 1)} disabled={page >= lastPage}>Next →</button>
                    </div>
                )}
            </section>
        </main>
    );
};

export default AdminDashboardUsersPage;
