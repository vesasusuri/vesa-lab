import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import SectionShell from './homeSections/SectionShell';

const GROUPS = [
  { id: 'hero_copy',      title: 'Hero & copy',    subtitle: 'Title and description on the Pricing page.' },
  { id: 'pricing_plans',  title: 'Pricing plans',  subtitle: 'Add, edit, or remove plans.' },
];

const COPY_FIELDS = [
  { key: 'heroEyebrow',     label: 'Hero eyebrow' },
  { key: 'heroTitle',       label: 'Hero title' },
  { key: 'heroDescription', label: 'Hero description', type: 'textarea' },
  { key: 'primaryCta',      label: 'Primary CTA' },
];

const EMPTY = { name: '', price: '', period: '/month', summary: '', highlights: '', featured: false };
const toArray = (str) => typeof str === 'string' ? str.split('\n').map(s => s.trim()).filter(Boolean) : (Array.isArray(str) ? str : []);
const toString = (arr) => Array.isArray(arr) ? arr.join('\n') : (arr || '');

const AdminPricingPanel = ({ pageContent, updatePageContent }) => {
  const [activeGroupId, setActiveGroupId] = useState('hero_copy');
  const [copyForm, setCopyForm]           = useState(pageContent || {});

  useEffect(() => { setCopyForm(pageContent || {}); }, [pageContent]);

  const updateCopyField = (key, value) => setCopyForm(cur => ({ ...cur, [key]: value }));
  const submitCopy = (e) => { e.preventDefault(); updatePageContent('pricing', copyForm); };

const [plans, setPlans]               = useState([]);
  const [form, setForm]                 = useState(EMPTY);
  const [loading, setLoading]           = useState(false);
  const [editId, setEditId]             = useState(null);
  const [editForm, setEditForm]         = useState(EMPTY);
  const [editLoading, setEditLoading]   = useState(false);

  const load = () => axios.get('/api/pricing-plans').then(r => setPlans(r.data));
  useEffect(() => { if (activeGroupId === 'pricing_plans') load(); }, [activeGroupId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/pricing-plans', { ...form, highlights: toArray(form.highlights) });
      setForm(EMPTY);
      load();
    } catch (err) {
      window.alert('Failed: ' + (err.response?.data?.message || err.message));
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this plan?')) return;
    await axios.delete(`/api/pricing-plans/${id}`);
    load();
  };

  const startEdit = (p) => {
    setEditId(p.id);
    setEditForm({ name: p.name, price: p.price, period: p.period, summary: p.summary || '', highlights: toString(p.highlights), featured: p.featured });
  };
  const cancelEdit = () => { setEditId(null); setEditForm(EMPTY); };

  const handleSave = async (id) => {
    setEditLoading(true);
    try {
      await axios.post(`/api/pricing-plans/${id}`, { ...editForm, highlights: toArray(editForm.highlights) });
      cancelEdit();
      load();
    } catch (err) {
      window.alert('Save failed: ' + (err.response?.data?.message || err.message));
    } finally { setEditLoading(false); }
  };

  return (
    <section className="admin-card admin-home-sections-card">
      <div className="admin-card-head">
        <div>
          <h2>Pricing page sections</h2>
          <p>Edit hero copy and manage pricing plans shown on the Pricing page.</p>
        </div>
      </div>

      <div className="admin-home-tabs" role="tablist">
        {GROUPS.map(g => (
          <button
            key={g.id}
            type="button"
            role="tab"
            aria-selected={activeGroupId === g.id}
            className={`admin-home-tab${activeGroupId === g.id ? ' active' : ''}`}
            onClick={() => setActiveGroupId(g.id)}
          >
            <span>{g.title}</span>
            <small>{g.subtitle}</small>
          </button>
        ))}
      </div>

      {/* Hero & copy */}
      {activeGroupId === 'hero_copy' && (
        <form className="admin-form-grid admin-form-grid--single-column admin-home-sections-form" onSubmit={submitCopy}>
          <SectionShell title="Hero & copy" subtitle="Titles and descriptions for the Pricing page.">
            <div className="admin-form-grid">
              {COPY_FIELDS.map(field => (
                <div key={field.key} className="admin-field">
                  <label>{field.label}</label>
                  {field.type === 'textarea'
                    ? <textarea value={copyForm[field.key] || ''} onChange={e => updateCopyField(field.key, e.target.value)} />
                    : <input value={copyForm[field.key] || ''} onChange={e => updateCopyField(field.key, e.target.value)} />
                  }
                </div>
              ))}
            </div>
          </SectionShell>
          <div className="admin-actions admin-home-save-row">
            <button type="submit" className="admin-btn admin-btn-accent"><FiEdit2 /> Save Pricing Copy</button>
          </div>
        </form>
      )}

      {/* Pricing plans */}
      {activeGroupId === 'pricing_plans' && (
        <div className="admin-form-grid admin-form-grid--single-column admin-home-sections-form">
          <SectionShell title="Pricing plans" subtitle="Add, edit, or remove plans shown on the Pricing page.">
            <form onSubmit={handleAdd}>
              <div className="admin-form-grid">
                <div className="admin-field"><label>Plan Name</label><input placeholder="e.g. Basic" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                <div className="admin-field"><label>Price</label><input placeholder="e.g. $19.99" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required /></div>
                <div className="admin-field"><label>Period</label><input placeholder="e.g. /month" value={form.period} onChange={e => setForm({ ...form, period: e.target.value })} /></div>
                <div className="admin-field"><label>Summary</label><input placeholder="e.g. For small teams" value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} /></div>
                <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                  <label>Highlights <small style={{ color: '#aaa', fontWeight: 400 }}>(one per line)</small></label>
                  <textarea rows={4} placeholder={'1 active role\nUp to 5 evaluators'} value={form.highlights} onChange={e => setForm({ ...form, highlights: e.target.value })} />
                </div>
                <div className="admin-field">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
                    Mark as Most Popular
                  </label>
                </div>
              </div>
              <div className="admin-actions" style={{ marginTop: 14 }}>
                <button type="submit" className="admin-btn admin-btn-dark" disabled={loading}><FiPlus />{loading ? 'Adding...' : 'Add Plan'}</button>
              </div>
            </form>

            {plans.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <p style={{ marginBottom: 12, color: '#7a746d', fontSize: 13 }}>{plans.length} plan{plans.length !== 1 ? 's' : ''} on the Pricing page</p>
                <table className="admin-table">
                  <thead><tr><th>Name</th><th>Price</th><th>Summary</th><th>Featured</th><th></th></tr></thead>
                  <tbody>
                    {plans.map(p => editId === p.id ? (
                      <tr key={p.id} style={{ background: '#fffdf6' }}>
                        <td><input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} style={{ border: '1px solid #e7e1d5', borderRadius: 8, padding: '6px 10px', fontSize: 13, width: '100%' }} /></td>
                        <td><input value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} style={{ border: '1px solid #e7e1d5', borderRadius: 8, padding: '6px 10px', fontSize: 13, width: 80 }} /></td>
                        <td><input value={editForm.summary} onChange={e => setEditForm({ ...editForm, summary: e.target.value })} style={{ border: '1px solid #e7e1d5', borderRadius: 8, padding: '6px 10px', fontSize: 13, width: '100%' }} /></td>
                        <td><input type="checkbox" checked={editForm.featured} onChange={e => setEditForm({ ...editForm, featured: e.target.checked })} /></td>
                        <td>
                          <div className="admin-actions">
                            <button className="admin-btn admin-btn-accent" disabled={editLoading} onClick={() => handleSave(p.id)}><FiCheck />{editLoading ? 'Saving...' : 'Save'}</button>
                            <button className="admin-btn admin-btn-light" onClick={cancelEdit}><FiX />Cancel</button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr key={p.id}>
                        <td><strong>{p.name}</strong>{p.featured && <span style={{ marginLeft: 6, fontSize: 11, background: '#fdd535', borderRadius: 999, padding: '2px 8px' }}>Popular</span>}</td>
                        <td>{p.price}{p.period}</td>
                        <td style={{ color: '#6f685d' }}>{p.summary}</td>
                        <td>{p.featured ? '✓' : '—'}</td>
                        <td>
                          <div className="admin-actions">
                            <button className="admin-btn admin-btn-light" onClick={() => startEdit(p)}><FiEdit2 />Edit</button>
                            <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(p.id)}><FiTrash2 />Remove</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionShell>
        </div>
      )}
    </section>
  );
};

export default AdminPricingPanel;
