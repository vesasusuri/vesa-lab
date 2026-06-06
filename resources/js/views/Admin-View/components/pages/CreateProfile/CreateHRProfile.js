import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { usePlatformAdmin } from '../../../../../context/PlatformAdminContext';
import '../../shared/AdminShared.scss';

const CreateHRProfile = () => {
  const { data, addRecord, updateRecord } = usePlatformAdmin();
  const [form, setForm] = useState({ name: '', email: '', role: 'User', status: 'Active' });
  const [inviteForm, setInviteForm] = useState({ company: '', email: '', role: data.settings.defaultInviteRole });

  const submit = (e) => {
    e.preventDefault();
    addRecord('users', form);
    setForm({ name: '', email: '', role: 'User', status: 'Active' });
  };

  const sendInvite = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`${data.settings.inviteEmailSubject} - ${inviteForm.company}`);
    const body = encodeURIComponent(
      `Hi,\n\n${data.settings.inviteEmailMessage}\n\nCompany: ${inviteForm.company}\nRole: ${inviteForm.role}\nInvite expires in: ${data.settings.inviteExpiryDays} days\n\nRegards,\nBee Hired Admin`
    );
    addRecord('hrInvites', { company: inviteForm.company, email: inviteForm.email, role: inviteForm.role, status: data.settings.requireAdminApprovalForHr ? 'Pending approval' : 'Sent' });
    window.open(`mailto:${inviteForm.email}?subject=${subject}&body=${body}`, '_blank');
    setInviteForm({ company: '', email: '', role: data.settings.defaultInviteRole });
  };

  return (
    <main className="admin-page">
      <section className="admin-card">
        <div className="admin-card-head"><h2>Invite HR to create profile</h2><p>Send an email invitation so HR can create their account/profile.</p></div>
        <form className="admin-form-grid" onSubmit={sendInvite}>
          <div className="admin-field"><label>Company</label><input value={inviteForm.company} onChange={(e) => setInviteForm((f) => ({ ...f, company: e.target.value }))} required /></div>
          <div className="admin-field"><label>HR email</label><input type="email" value={inviteForm.email} onChange={(e) => setInviteForm((f) => ({ ...f, email: e.target.value }))} required /></div>
          <div className="admin-field"><label>Role</label><select value={inviteForm.role} onChange={(e) => setInviteForm((f) => ({ ...f, role: e.target.value }))}><option>HR Manager</option><option>Recruiter</option><option>Hiring Lead</option></select></div>
          <div className="admin-actions"><button className="admin-btn admin-btn-accent" type="submit"><FiPlus />Send Email Invite</button></div>
        </form>
        <table className="admin-table">
          <thead><tr><th>Company</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {data.hrInvites.map((invite) => (
              <tr key={invite.id}>
                <td>{invite.company}</td>
                <td>{invite.email}</td>
                <td>{invite.role || data.settings.defaultInviteRole}</td>
                <td>{invite.status}</td>
                <td><button className="admin-btn admin-btn-light" onClick={() => updateRecord('hrInvites', invite.id, { status: 'Accepted' })}>Mark Accepted</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default CreateHRProfile;
