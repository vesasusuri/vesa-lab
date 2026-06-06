import React, { useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { usePlatformAdmin } from '../../../../../context/PlatformAdminContext';
import '../../shared/AdminShared.scss';

const CreateUser = () => {
  const { data, addRecord, deleteRecord, updateRecord } = usePlatformAdmin();
  const [form, setForm] = useState({ name: '', email: '', role: 'User', status: 'Active' });
  const [inviteForm, setInviteForm] = useState({ company: '', email: '', role: data.settings.defaultInviteRole });

  const submit = (e) => {
    e.preventDefault();
    addRecord('users', form);
    setForm({ name: '', email: '', role: 'User', status: 'Active' });
  };
  return (
    <main className="admin-page">
      <section className="admin-card">
        <div className="admin-card-head"><h2>Users CRUD</h2><p>Manage admins and platform users centrally.</p></div>
        <form className="admin-form-grid" onSubmit={submit}>
          <div className="admin-field"><label>Name</label><input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required /></div>
          <div className="admin-field"><label>Email</label><input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required /></div>
          <div className="admin-field"><label>Role</label><select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}><option>User</option><option>HR</option><option>Admin</option></select></div>
          <div className="admin-field"><label>Status</label><select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}><option>Active</option><option>Suspended</option></select></div>
          <div className="admin-actions"><button className="admin-btn admin-btn-accent" type="submit"><FiPlus />Create User</button></div>
        </form>
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {data.users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td><button className="admin-btn admin-btn-light" onClick={() => deleteRecord('users', user.id)}><FiTrash2 />Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default CreateUser;
