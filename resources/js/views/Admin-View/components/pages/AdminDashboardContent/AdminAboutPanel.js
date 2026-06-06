import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { FiEdit2, FiPlus, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import * as Yup from 'yup';

const memberSchema = Yup.object({
  name: Yup.string().trim().matches(/^[^\d]*$/, 'Name cannot contain numbers.').required('Name is required.'),
});
import SectionShell from './homeSections/SectionShell';
import { patchSectionItems } from './homeSections/patchSectionItems';
import { AboutStatsFields, AboutOverviewFields } from './homeSections/HomeSectionEditorBlocks';

const GROUPS = [
  { id: 'hero_copy',      title: 'Hero & copy',      subtitle: 'Titles, descriptions, and CTAs.' },
  { id: 'about_stats',    title: 'Stats',             subtitle: 'Numbers in the Our Work section.' },
  { id: 'about_overview', title: 'Overview panels',   subtitle: 'Mission & workflow text panels.' },
  { id: 'team',           title: 'Team members',      subtitle: 'Photos, names, and bios on About Us.' },
];

const COPY_FIELDS = [
  { key: 'heroEyebrow',        label: 'Hero eyebrow' },
  { key: 'heroTitle',          label: 'Hero title' },
  { key: 'heroDescription',    label: 'Hero description',    type: 'textarea' },
  { key: 'heroBgImage',        label: 'Hero background image URL' },
  { key: 'missionTitle',       label: 'Mission title' },
  { key: 'missionDescription', label: 'Mission description', type: 'textarea' },
  { key: 'overviewEyebrow',    label: 'Overview eyebrow' },
  { key: 'statsTitle',         label: 'Stats section title' },
  { key: 'primaryCta',         label: 'Primary CTA' },
];

const AdminAboutPanel = ({
  pageContent,
  updatePageContent,
  homeSectionsForm,
  setHomeSectionsForm,
  persistHomeSections,
  createHomeSectionItem,
  deleteHomeSectionItem,
}) => {
  const [activeGroupId, setActiveGroupId] = useState('hero_copy');
  const [copyForm, setCopyForm] = useState(pageContent || {});

  useEffect(() => { setCopyForm(pageContent || {}); }, [pageContent]);

  const updateCopyField = (key, value) => setCopyForm(cur => ({ ...cur, [key]: value }));

  const submitCopy = (e) => {
    e.preventDefault();
    updatePageContent('about', copyForm);
  };
  const activeGroup = GROUPS.find(g => g.id === activeGroupId) || GROUPS[0];

const byKey = useMemo(() => {
    const map = {};
    (homeSectionsForm || []).forEach(s => { map[s.key] = s; });
    return map;
  }, [homeSectionsForm]);

  const updateSectionTitle = (sectionKey, value) => {
    setHomeSectionsForm(cur => cur.map(s => s.key === sectionKey ? { ...s, title: value } : s));
  };

  const updateItemField = (sectionKey, itemIndex, field, value) => {
    setHomeSectionsForm(cur => patchSectionItems(cur, sectionKey, items =>
      items.map((item, idx) => idx === itemIndex ? { ...item, [field]: value } : item)
    ));
  };

  const onAddItem = async (sectionKey, defaults) => {
    const created = await createHomeSectionItem(sectionKey, defaults);
    if (!created) window.alert('Could not add item.');
  };

  const onDeleteItem = async (item) => {
    if (!item?.id) return;
    if (!window.confirm('Delete this item?')) return;
    const ok = await deleteHomeSectionItem(item.id);
    if (!ok) window.alert('Could not delete item.');
  };

  const handleSaveAll = async (e) => {
    e.preventDefault();
    const ok = await persistHomeSections(homeSectionsForm);
    if (ok) window.alert('About sections saved.');
    else window.alert('Unable to save. Please try again.');
  };

const [members, setMembers]         = useState([]);
  const [addForm, setAddForm]         = useState({ name: '', occupation: '', bio: '' });
  const [addImage, setAddImage]       = useState(null);
  const [addLoading, setAddLoading]   = useState(false);
  const [addErrors, setAddErrors]     = useState({});
  const [editId, setEditId]           = useState(null);
  const [editForm, setEditForm]       = useState({ name: '', occupation: '', bio: '' });
  const [editImage, setEditImage]     = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const loadMembers = () => axios.get('/api/team-members').then(r => setMembers(r.data));

  useEffect(() => {
    if (activeGroupId === 'team') loadMembers();
  }, [activeGroupId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await memberSchema.validate(addForm, { abortEarly: false });
      setAddErrors({});
    } catch (err) {
      setAddErrors(err.inner.reduce((acc, e) => ({ ...acc, [e.path]: e.message }), {}));
      return;
    }
    setAddLoading(true);
    const fd = new FormData();
    fd.append('name', addForm.name);
    fd.append('occupation', addForm.occupation);
    fd.append('bio', addForm.bio);
    if (addImage) fd.append('image', addImage);
    try {
      await axios.post('/api/team-members', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setAddForm({ name: '', occupation: '', bio: '' });
      setAddImage(null);
      loadMembers();
    } catch (err) {
      window.alert('Failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setAddLoading(false);
    }
  };

  const startEdit = (m) => {
    setEditId(m.id);
    setEditForm({ name: m.name, occupation: m.occupation, bio: m.bio });
    setEditImage(null);
    setEditPreview(m.img || null);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({ name: '', occupation: '', bio: '' });
    setEditImage(null);
    setEditPreview(null);
  };

  const handleSaveMember = async (id) => {
    setEditLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', editForm.name);
      fd.append('occupation', editForm.occupation);
      fd.append('bio', editForm.bio);
      if (editImage) fd.append('image', editImage);
      await axios.post(`/api/team-members/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      cancelEdit();
      loadMembers();
    } catch (err) {
      window.alert('Save failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this member?')) return;
    await axios.delete(`/api/team-members/${id}`);
    loadMembers();
  };

return (
    <section className="admin-card admin-home-sections-card">
      <div className="admin-card-head">
        <div>
          <h2>About page sections</h2>
          <p>Edit stats, overview panels, and team members. Save writes to the database. Add / Remove runs immediately.</p>
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

      {}
      {activeGroupId === 'hero_copy' && (
        <form className="admin-form-grid admin-form-grid--single-column admin-home-sections-form" onSubmit={submitCopy}>
          <SectionShell title="Hero & copy" subtitle="Titles, descriptions, and CTAs for the About Us page.">
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
            <button type="submit" className="admin-btn admin-btn-accent"><FiEdit2 /> Save About Copy</button>
          </div>
        </form>
      )}

      {/* Stats & Overview — save via form */}
      {(activeGroupId === 'about_stats' || activeGroupId === 'about_overview') && (
        <form className="admin-form-grid admin-form-grid--single-column admin-home-sections-form" onSubmit={handleSaveAll}>
          <SectionShell key={activeGroupId} title={activeGroup.title} subtitle={activeGroup.subtitle}>
            {activeGroupId === 'about_stats' && byKey['about_stats'] && (
              <AboutStatsFields
                section={byKey['about_stats']}
                updateSectionTitle={updateSectionTitle}
                updateItemField={updateItemField}
                onAddItem={onAddItem}
                onDeleteItem={onDeleteItem}
              />
            )}
            {activeGroupId === 'about_overview' && byKey['about_overview'] && (
              <AboutOverviewFields
                section={byKey['about_overview']}
                updateItemField={updateItemField}
                onAddItem={onAddItem}
                onDeleteItem={onDeleteItem}
              />
            )}
          </SectionShell>
          <div className="admin-actions admin-home-save-row">
            <button type="submit" className="admin-btn admin-btn-accent">
              <FiEdit2 /> Save About Sections
            </button>
          </div>
        </form>
      )}

      {}
      {activeGroupId === 'team' && (
        <div className="admin-form-grid admin-form-grid--single-column admin-home-sections-form">
          <SectionShell title="Team members" subtitle="Photos, names, and bios on the About Us page.">
          {}
          <form onSubmit={handleAdd}>
            <div className="admin-form-grid">
              <div className="admin-field">
                <label>Full Name</label>
                <input placeholder="e.g. John Doe" value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} required />
                {addErrors.name && <span style={{ color: 'red', fontSize: '12px' }}>{addErrors.name}</span>}
              </div>
              <div className="admin-field">
                <label>Occupation</label>
                <input placeholder="e.g. Lead Developer" value={addForm.occupation} onChange={e => setAddForm({ ...addForm, occupation: e.target.value })} required />
              </div>
              <div className="admin-field">
                <label>Photo</label>
                <input type="file" accept="image/*" onChange={e => setAddImage(e.target.files[0])} />
              </div>
              <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                <label>Bio</label>
                <textarea placeholder="Short bio..." value={addForm.bio} onChange={e => setAddForm({ ...addForm, bio: e.target.value })} required />
              </div>
            </div>
            <div className="admin-actions" style={{ marginTop: 14 }}>
              <button type="submit" className="admin-btn admin-btn-dark" disabled={addLoading}>
                <FiPlus />{addLoading ? 'Adding...' : 'Add Member'}
              </button>
            </div>
          </form>

          {}
          {members.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <p style={{ marginBottom: 12, color: '#7a746d', fontSize: 13 }}>{members.length} member{members.length !== 1 ? 's' : ''} on the About Us page</p>
              <table className="admin-table">
                <thead>
                  <tr><th>Photo</th><th>Name</th><th>Occupation</th><th>Bio</th><th></th></tr>
                </thead>
                <tbody>
                  {members.map(m => editId === m.id ? (
                    <tr key={m.id} style={{ background: '#fffdf6' }}>
                      <td>
                        <div onClick={() => document.getElementById(`edit-img-${m.id}`).click()} style={{ position: 'relative', width: 40, height: 40, cursor: 'pointer' }} title="Click to change photo">
                          {editPreview
                            ? <img src={editPreview} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                            : <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fdd535', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{editForm.name[0]}</div>
                          }
                          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FiEdit2 size={13} color="#fff" />
                          </div>
                          <input id={`edit-img-${m.id}`} type="file" accept="image/*" onChange={e => { setEditImage(e.target.files[0]); setEditPreview(URL.createObjectURL(e.target.files[0])); }} hidden />
                        </div>
                      </td>
                      <td><input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} style={{ border: '1px solid #e7e1d5', borderRadius: 8, padding: '6px 10px', fontSize: 13, width: '100%' }} /></td>
                      <td><input value={editForm.occupation} onChange={e => setEditForm({ ...editForm, occupation: e.target.value })} style={{ border: '1px solid #e7e1d5', borderRadius: 8, padding: '6px 10px', fontSize: 13, width: '100%' }} /></td>
                      <td><textarea value={editForm.bio} onChange={e => setEditForm({ ...editForm, bio: e.target.value })} rows={3} style={{ border: '1px solid #e7e1d5', borderRadius: 8, padding: '6px 10px', fontSize: 13, width: '100%', resize: 'vertical' }} /></td>
                      <td>
                        <div className="admin-actions">
                          <button className="admin-btn admin-btn-accent" disabled={editLoading} onClick={() => handleSaveMember(m.id)}>
                            <FiCheck />{editLoading ? 'Saving...' : 'Save'}
                          </button>
                          <button className="admin-btn admin-btn-light" onClick={cancelEdit}>
                            <FiX />Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={m.id}>
                      <td>
                        {m.img
                          ? <img src={m.img} alt={m.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                          : <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fdd535', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>{m.name[0]}</div>
                        }
                      </td>
                      <td><strong>{m.name}</strong></td>
                      <td>{m.occupation}</td>
                      <td style={{ maxWidth: 260, color: '#6f685d' }}>{m.bio}</td>
                      <td>
                        <div className="admin-actions">
                          <button className="admin-btn admin-btn-light" onClick={() => startEdit(m)}><FiEdit2 />Edit</button>
                          <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(m.id)}><FiTrash2 />Remove</button>
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

export default AdminAboutPanel;
