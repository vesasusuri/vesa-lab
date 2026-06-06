import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import '../../components/shared/AdminShared.scss';
import './AdminPricing.scss';

const EMPTY_PLAN = { name: '', price: '', period: '/month', summary: '', highlights: '', featured: false };

const highlightsToArray = (str) =>
    typeof str === 'string'
        ? str.split('\n').map(s => s.trim()).filter(Boolean)
        : (Array.isArray(str) ? str : []);

const highlightsToString = (arr) =>
    Array.isArray(arr) ? arr.join('\n') : (arr || '');

const AdminPricing = () => {
    const [plans, setPlans]           = useState([]);
    const [form, setForm]             = useState(EMPTY_PLAN);
    const [loading, setLoading]       = useState(false);
    const [editId, setEditId]         = useState(null);
    const [editForm, setEditForm]     = useState(EMPTY_PLAN);
    const [editLoading, setEditLoading] = useState(false);

    const load = () => axios.get('/api/pricing-plans').then(r => setPlans(r.data));
    useEffect(() => { load(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/api/pricing-plans', { ...form, highlights: highlightsToArray(form.highlights) });
            setForm(EMPTY_PLAN);
            load();
        } catch (err) {
            alert('Failed: ' + (err.response?.data?.message || err.message));
        } finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this plan?')) return;
        await axios.delete(`/api/pricing-plans/${id}`);
        load();
    };

    const startEdit = (p) => {
        setEditId(p.id);
        setEditForm({ name: p.name, price: p.price, period: p.period, summary: p.summary || '', highlights: highlightsToString(p.highlights), featured: p.featured });
    };

    const cancelEdit = () => { setEditId(null); setEditForm(EMPTY_PLAN); };

    const handleSave = async (id) => {
        setEditLoading(true);
        try {
            await axios.post(`/api/pricing-plans/${id}`, { ...editForm, highlights: highlightsToArray(editForm.highlights) });
            cancelEdit();
            load();
        } catch (err) {
            alert('Save failed: ' + (err.response?.data?.message || err.message));
        } finally { setEditLoading(false); }
    };

    return (
        <main className="admin-page">

            {/* Add Plan */}
            <section className="admin-card">
                <div className="admin-card-head">
                    <div>
                        <h2>Pricing Plans</h2>
                        <p>These appear on the Pricing page.</p>
                    </div>
                </div>
                <form onSubmit={handleAdd}>
                    <div className="admin-form-grid">
                        <div className="admin-field">
                            <label>Plan Name</label>
                            <input placeholder="e.g. Basic" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                        </div>
                        <div className="admin-field">
                            <label>Price</label>
                            <input placeholder="e.g. $19.99" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                        </div>
                        <div className="admin-field">
                            <label>Period</label>
                            <input placeholder="e.g. /month" value={form.period} onChange={e => setForm({ ...form, period: e.target.value })} />
                        </div>
                        <div className="admin-field">
                            <label>Summary</label>
                            <input placeholder="e.g. For small teams hiring occasionally." value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} />
                        </div>
                        <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                            <label>Highlights <small style={{ color: '#aaa', fontWeight: 400 }}>(one per line)</small></label>
                            <textarea rows={4} placeholder={'1 active role\nUp to 5 evaluators\nEmail support'} value={form.highlights} onChange={e => setForm({ ...form, highlights: e.target.value })} />
                        </div>
                        <div className="admin-field">
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
                                Mark as Most Popular
                            </label>
                        </div>
                    </div>
                    <div className="admin-actions" style={{ marginTop: 14 }}>
                        <button type="submit" className="admin-btn admin-btn-dark" disabled={loading}>
                            <FiPlus /> {loading ? 'Adding...' : 'Add Plan'}
                        </button>
                    </div>
                </form>
            </section>

            {}
            {plans.length > 0 && (
                <section className="admin-card">
                    <div className="admin-card-head">
                        <div>
                            <h2>Current Plans</h2>
                            <p>{plans.length} plan{plans.length !== 1 ? 's' : ''} on the Pricing page</p>
                        </div>
                    </div>

                    <div className="apc-grid">
                        {plans.map(p => editId === p.id ? (

                            <div key={p.id} className="apc-card apc-card--editing">
                                <div className="apc-field">
                                    <label>Name</label>
                                    <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                                </div>
                                <div className="apc-row">
                                    <div className="apc-field">
                                        <label>Price</label>
                                        <input value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} />
                                    </div>
                                    <div className="apc-field">
                                        <label>Period</label>
                                        <input value={editForm.period} onChange={e => setEditForm({ ...editForm, period: e.target.value })} />
                                    </div>
                                </div>
                                <div className="apc-field">
                                    <label>Summary</label>
                                    <input value={editForm.summary} onChange={e => setEditForm({ ...editForm, summary: e.target.value })} />
                                </div>
                                <div className="apc-field">
                                    <label>Highlights <small>(one per line)</small></label>
                                    <textarea rows={4} value={editForm.highlights} onChange={e => setEditForm({ ...editForm, highlights: e.target.value })} />
                                </div>
                                <div className="apc-field">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                                        <input type="checkbox" checked={editForm.featured} onChange={e => setEditForm({ ...editForm, featured: e.target.checked })} />
                                        Most Popular
                                    </label>
                                </div>
                                <div className="admin-actions" style={{ marginTop: 12 }}>
                                    <button className="admin-btn admin-btn-accent" onClick={() => handleSave(p.id)} disabled={editLoading}>
                                        <FiCheck /> {editLoading ? 'Saving...' : 'Save'}
                                    </button>
                                    <button className="admin-btn admin-btn-light" onClick={cancelEdit}>
                                        <FiX /> Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            
                            <div key={p.id} className={`apc-card${p.featured ? ' apc-card--featured' : ''}`}>
                                {p.featured && <span className="apc-badge">Most Popular</span>}
                                <h3 className="apc-name">{p.name}</h3>
                                <p className="apc-price">
                                    {p.price}<small>{p.period}</small>
                                </p>
                                <p className="apc-summary">{p.summary}</p>
                                <ul className="apc-highlights">
                                    {(p.highlights || []).map((h, i) => <li key={i}>{h}</li>)}
                                </ul>
                                <div className="admin-actions apc-actions">
                                    <button className="admin-btn admin-btn-light" onClick={() => startEdit(p)}>
                                        <FiEdit2 /> Edit
                                    </button>
                                    <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(p.id)}>
                                        <FiTrash2 /> Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
};

export default AdminPricing;
