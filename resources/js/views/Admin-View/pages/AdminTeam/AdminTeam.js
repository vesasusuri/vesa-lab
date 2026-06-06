import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import '../../components/shared/AdminShared.scss';

const AdminTeam = () => {
    const [members, setMembers]       = useState([]);
    const [name, setName]             = useState('');
    const [occupation, setOccupation] = useState('');
    const [bio, setBio]               = useState('');
    const [image, setImage]           = useState(null);
    const [preview, setPreview]       = useState(null);
    const [loading, setLoading]       = useState(false);

const [editId, setEditId]                   = useState(null);
    const [editName, setEditName]               = useState('');
    const [editOccupation, setEditOccupation]   = useState('');
    const [editBio, setEditBio]                 = useState('');
    const [editImage, setEditImage]             = useState(null);
    const [editPreview, setEditPreview]         = useState(null);
    const [editLoading, setEditLoading]         = useState(false);

    const load = () => {
        axios.get('/api/team-members').then(r => setMembers(r.data));
    };

    useEffect(() => { load(); }, []);

    const handleImage = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setLoading(true);
        const form = new FormData();
        form.append('name', name);
        form.append('occupation', occupation);
        form.append('bio', bio);
        if (image) form.append('image', image);

        await axios.post('/api/team-members', form, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        setName(''); setOccupation(''); setBio('');
        setImage(null); setPreview(null);
        setLoading(false);
        load();
    };

    const handleDelete = async (id) => {
        await axios.delete(`/api/team-members/${id}`);
        load();
    };

    const startEdit = (m) => {
        setEditId(m.id);
        setEditName(m.name);
        setEditOccupation(m.occupation);
        setEditBio(m.bio);
        setEditImage(null);
        setEditPreview(m.img || null);
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditName(''); setEditOccupation(''); setEditBio('');
        setEditImage(null); setEditPreview(null);
    };

    const handleEditImage = (e) => {
        const file = e.target.files[0];
        setEditImage(file);
        setEditPreview(URL.createObjectURL(file));
    };

    const handleSave = async (id) => {
        setEditLoading(true);
        try {
            const form = new FormData();
            form.append('name', editName);
            form.append('occupation', editOccupation);
            form.append('bio', editBio);
            if (editImage) form.append('image', editImage);

            await axios.post(`/api/team-members/${id}`, form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            cancelEdit();
            load();
        } catch (err) {
            console.error('Save failed:', err.response?.data || err.message);
            alert('Save failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setEditLoading(false);
        }
    };

    return (
        <main className="admin-page">

            {}
            <section className="admin-card">
                <div className="admin-card-head">
                    <div>
                        <h2>Team Members</h2>
                        <p>These appear on the About Us page.</p>
                    </div>
                </div>

                <form onSubmit={handleAdd}>
                    <div className="admin-form-grid">
                        <div className="admin-field">
                            <label>Full Name</label>
                            <input
                                placeholder="e.g. John Doe"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="admin-field">
                            <label>Occupation</label>
                            <input
                                placeholder="e.g. Lead Developer"
                                value={occupation}
                                onChange={e => setOccupation(e.target.value)}
                                required
                            />
                        </div>
                        <div className="admin-field">
                            <label>Photo</label>
                            <input type="file" accept="image/*" onChange={handleImage} />
                        </div>
                        <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                            <label>Bio</label>
                            <textarea
                                placeholder="Short bio about this person..."
                                value={bio}
                                onChange={e => setBio(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="admin-actions" style={{ marginTop: '14px' }}>
                        <button type="submit" className="admin-btn admin-btn-dark" disabled={loading}>
                            <FiPlus />
                            {loading ? 'Adding...' : 'Add Member'}
                        </button>
                    </div>
                </form>
            </section>

            {}
            {members.length > 0 && (
                <section className="admin-card">
                    <div className="admin-card-head">
                        <div>
                            <h2>Current Members</h2>
                            <p>{members.length} member{members.length !== 1 ? 's' : ''} on the About Us page</p>
                        </div>
                    </div>

                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Photo</th>
                                <th>Name</th>
                                <th>Occupation</th>
                                <th>Bio</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map(m => editId === m.id ? (

                                <tr key={m.id} style={{ background: '#fffdf6' }}>
                                    <td>
                                        <div
                                            onClick={() => document.getElementById(`edit-img-${m.id}`).click()}
                                            style={{ position: 'relative', width: 40, height: 40, cursor: 'pointer' }}
                                            title="Click to change photo"
                                        >
                                            {editPreview
                                                ? <img src={editPreview} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                                                : <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fdd535', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{editName[0]}</div>
                                            }
                                            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <FiEdit2 size={13} color="#fff" />
                                            </div>
                                            <input id={`edit-img-${m.id}`} type="file" accept="image/*" onChange={handleEditImage} hidden />
                                        </div>
                                    </td>
                                    <td>
                                        <input
                                            className="admin-field input"
                                            value={editName}
                                            onChange={e => setEditName(e.target.value)}
                                            style={{ border: '1px solid #e7e1d5', borderRadius: 8, padding: '6px 10px', fontSize: 13, width: '100%' }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            value={editOccupation}
                                            onChange={e => setEditOccupation(e.target.value)}
                                            style={{ border: '1px solid #e7e1d5', borderRadius: 8, padding: '6px 10px', fontSize: 13, width: '100%' }}
                                        />
                                    </td>
                                    <td>
                                        <textarea
                                            value={editBio}
                                            onChange={e => setEditBio(e.target.value)}
                                            rows={3}
                                            style={{ border: '1px solid #e7e1d5', borderRadius: 8, padding: '6px 10px', fontSize: 13, width: '100%', resize: 'vertical' }}
                                        />
                                    </td>
                                    <td>
                                        <div className="admin-actions">
                                            <button className="admin-btn admin-btn-accent" onClick={() => handleSave(m.id)} disabled={editLoading}>
                                                <FiCheck />
                                                {editLoading ? 'Saving...' : 'Save'}
                                            </button>
                                            <button className="admin-btn admin-btn-light" onClick={cancelEdit}>
                                                <FiX />
                                                Cancel
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
                                            <button className="admin-btn admin-btn-light" onClick={() => startEdit(m)}>
                                                <FiEdit2 />
                                                Edit
                                            </button>
                                            <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(m.id)}>
                                                <FiTrash2 />
                                                Remove
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}
        </main>
    );
};

export default AdminTeam;
