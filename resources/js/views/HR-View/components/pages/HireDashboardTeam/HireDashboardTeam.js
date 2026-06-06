import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import {
  fetchHrTeam, addHrTeamMember, removeHrTeamMember,
  fetchHrTeamNotes, createHrTeamNote, updateHrTeamNote, deleteHrTeamNote,
} from '../../../../../api/hrApi';
import './HireDashboardTeam.scss';

const memberSchema = Yup.object({
  name: Yup.string().trim().matches(/^[^\d]*$/, 'Name cannot contain numbers.').required('Name is required.'),
});

const AVATAR_COLORS = ['#111111', '#3b5bdb', '#2d7a5a', '#9a7000', '#c0392b', '#6741d9'];

const PinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 2a4 4 0 0 0-3.95 4.57L6 13H3.5a.5.5 0 0 0-.35.85l3 3a.5.5 0 0 0 .35.15H9v4.5a.5.5 0 0 0 1 0V17h2.5a.5.5 0 0 0 .35-.15l.92-.92A4 4 0 1 0 16 2z"/>
  </svg>
);

const getInitials = (name) =>
  (name || '?').trim().split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

const HireDashboardTeam = () => {

  const [team,          setTeam]          = useState([]);
  const [teamLoaded,    setTeamLoaded]    = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember,     setNewMember]     = useState({ name: '', title: '', photo: null, file: null });
  const [saving,        setSaving]        = useState(false);
  const [removingId,    setRemovingId]    = useState(null);
  const [memberErrors,  setMemberErrors]  = useState({});

  useEffect(() => {
    fetchHrTeam()
      .then((data) => {
        if (Array.isArray(data)) {
          setTeam(data.map((m) => ({
            id:       m.id,
            name:     m.name,
            title:    m.title,
            initials: getInitials(m.name),
            photo:    m.photo || null,
          })));
        }
        setTeamLoaded(true);
      })
      .catch(() => setTeamLoaded(true));
  }, []);

  const handleMemberPhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setNewMember((prev) => ({ ...prev, photo: ev.target.result, file }));
    reader.readAsDataURL(file);
  };

  const addMember = async () => {
    try {
      await memberSchema.validate(newMember, { abortEarly: false });
      setMemberErrors({});
    } catch (err) {
      setMemberErrors(err.inner.reduce((acc, e) => ({ ...acc, [e.path]: e.message }), {}));
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name',  newMember.name.trim());
      formData.append('title', newMember.title.trim() || 'Team Member');
      if (newMember.file) formData.append('photo', newMember.file);

      const saved = await addHrTeamMember(formData);
      setTeam((prev) => [
        ...prev,
        {
          id:       saved.id,
          name:     saved.name,
          title:    saved.title,
          initials: getInitials(saved.name),
          photo:    saved.photo || null,
        },
      ]);
      setNewMember({ name: '', title: '', photo: null, file: null });
      setShowAddMember(false);
    } catch {

    } finally {
      setSaving(false);
    }
  };

  const removeMember = async (id) => {
    setRemovingId(id);
    try {
      await removeHrTeamMember(id);
      setTimeout(() => {
        setTeam((prev) => prev.filter((m) => m.id !== id));
        setRemovingId(null);
      }, 280);
    } catch {
      setRemovingId(null);
    }
  };

const [notes,       setNotes]       = useState([]);
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote,     setNewNote]     = useState({ from: '', to: '', content: '' });
  const [savingNote,  setSavingNote]  = useState(false);

  useEffect(() => {
    fetchHrTeamNotes()
      .then((data) => {
        if (Array.isArray(data)) {
          setNotes(data.map((n) => ({
            id:      n.id,
            from:    n.from_name ?? '',
            to:      n.to_name   ?? '',
            content: n.content,
            done:    n.done,
          })));
        }
      })
      .catch(() => {});
  }, []);

  const addNote = async () => {
    if (!newNote.content.trim()) return;
    setSavingNote(true);
    try {
      const saved = await createHrTeamNote({
        content:   newNote.content.trim(),
        from_name: newNote.from.trim(),
        to_name:   newNote.to.trim(),
      });
      setNotes((prev) => [{
        id: saved.id, from: saved.from_name ?? '', to: saved.to_name ?? '',
        content: saved.content, done: saved.done,
      }, ...prev]);
      setNewNote({ from: '', to: '', content: '' });
      setShowAddNote(false);
    } catch {

    } finally {
      setSavingNote(false);
    }
  };

  const toggleDone = async (id) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    const next = !note.done;
    setNotes((prev) => prev.map((n) => n.id === id ? { ...n, done: next } : n));
    try {
      await updateHrTeamNote(id, { done: next });
    } catch {
      setNotes((prev) => prev.map((n) => n.id === id ? { ...n, done: note.done } : n));
    }
  };

  const deleteNote = async (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    try {
      await deleteHrTeamNote(id);
    } catch {

    }
  };

  return (
    <section className="hire-team-section">
      <div className="hire-team-wrapper">

        <div className="hire-team-page-header">
          <h1>Team</h1>
          <p>Manage your hiring team and leave notes for your coworkers.</p>
        </div>

        <div className="hire-team-columns">

          {/* LEFT — Hiring Team */}
          <div className="hire-team-block">
            <div className="hire-team-block-header">
              <div>
                <h2>Hiring Team</h2>
                <p>Members of your recruiting team.</p>
              </div>
              <button className="hire-team-add-btn" onClick={() => setShowAddMember((v) => !v)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add
              </button>
            </div>

            {showAddMember && (
              <div className="hire-team-add-form">
                <label className="hire-member-photo-upload">
                  {newMember.photo
                    ? <img src={newMember.photo} className="hire-member-photo-preview" alt="preview" />
                    : (
                      <div className="hire-member-photo-placeholder">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                          <circle cx="12" cy="13" r="4"/>
                        </svg>
                        <span>Add Photo</span>
                      </div>
                    )
                  }
                  <input type="file" accept="image/*" onChange={handleMemberPhoto} style={{ display: 'none' }} />
                </label>
                <input
                  placeholder="Full name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && addMember()}
                  autoFocus
                />
                {memberErrors.name && <span style={{ color: 'red', fontSize: '12px' }}>{memberErrors.name}</span>}
                <input
                  placeholder="Title (e.g. Recruiter)"
                  value={newMember.title}
                  onChange={(e) => setNewMember({ ...newMember, title: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && addMember()}
                />
                <div className="hire-team-form-btns">
                  <button className="hire-team-confirm" onClick={addMember} disabled={saving}>
                    {saving ? 'Saving…' : 'Add Member'}
                  </button>
                  <button className="hire-team-cancel" onClick={() => { setShowAddMember(false); setNewMember({ name: '', title: '', photo: null, file: null }); }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {teamLoaded && team.length === 0 && (
              <div className="hire-team-empty">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <p>No team members yet.<br />Click <strong>Add</strong> to build your hiring team.</p>
              </div>
            )}

            <div className="hire-team-grid">
              {team.map((member, i) => (
                <div
                  key={member.id}
                  className={`hire-member-card${removingId === member.id ? ' removing' : ''}`}
                >
                  <div className="hire-mc-photo-zone">
                    {member.photo
                      ? <img className="hire-mc-photo" src={member.photo} alt={member.name} />
                      : <div className="hire-mc-initials" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>{member.initials}</div>
                    }
                  </div>
                  <div className="hire-mc-banner">
                    <div className="hire-mc-name">{member.name}</div>
                    <div className="hire-mc-role">{member.title}</div>
                  </div>
                  <button className="hire-member-remove" onClick={() => removeMember(member.id)} type="button">✕</button>
                </div>
              ))}

              <button className="hire-member-card hire-member-add-card" onClick={() => setShowAddMember(true)} type="button">
                <div className="hire-mc-add-content">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  <span>Add Member</span>
                </div>
              </button>
            </div>
          </div>

          {/* RIGHT — Team Notes */}
          <div className="hire-team-block">
            <div className="hire-team-block-header">
              <div>
                <h2>Team Notes</h2>
                <p>Leave notes for your HR coworkers.</p>
              </div>
              <button className="hire-team-add-btn" onClick={() => setShowAddNote((v) => !v)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                New Note
              </button>
            </div>

            {showAddNote && (
              <div className="hire-team-add-form">
                <div className="hire-note-form-row">
                  <input placeholder="From" value={newNote.from} onChange={(e) => setNewNote({ ...newNote, from: e.target.value })} />
                  <input placeholder="To"   value={newNote.to}   onChange={(e) => setNewNote({ ...newNote, to:   e.target.value })} />
                </div>
                <textarea
                  placeholder="Write your note…"
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  rows={3}
                  autoFocus
                />
                <div className="hire-team-form-btns">
                  <button className="hire-team-confirm" onClick={addNote} disabled={savingNote}>
                    {savingNote ? 'Saving…' : 'Post Note'}
                  </button>
                  <button className="hire-team-cancel"  onClick={() => setShowAddNote(false)}>Cancel</button>
                </div>
              </div>
            )}

            {notes.length === 0 && (
              <div className="hire-team-empty">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                </svg>
                <p>No notes yet.<br />Click <strong>New Note</strong> to leave a message for your team.</p>
              </div>
            )}

            <div className="hire-notes-grid">
              {notes.map((note) => (
                <div key={note.id} className={`hire-note-card${note.done ? ' done' : ''}`}>
                  <div className="hire-note-pin"><PinIcon /></div>
                  <button className="hire-note-delete" onClick={() => deleteNote(note.id)} type="button">✕</button>
                  <div className="hire-note-meta">
                    {note.from && <span><strong>From:</strong> {note.from}</span>}
                    {note.to   && <span><strong>To:</strong> {note.to}</span>}
                  </div>
                  <p className="hire-note-content">{note.content}</p>
                  <div className="hire-note-footer">
                    <label className="hire-note-check">
                      <input type="checkbox" checked={note.done} onChange={() => toggleDone(note.id)} />
                      <span>{note.done ? 'Done ✓' : 'Mark as done'}</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HireDashboardTeam;
