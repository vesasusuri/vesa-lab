import React from 'react';
import { usePlatformAdmin } from '../../../../../context/PlatformAdminContext';
import '../../shared/AdminShared.scss';

const AdminDashboardSettings = () => {
  const { data, updateSetting } = usePlatformAdmin();

  return (
    <main className="admin-page">
      <section className="admin-card">
        <div className="admin-card-head">
          <div>
            <h2>Global UI and platform settings</h2>
            <p>These settings are shared by admin-managed UI sections.</p>
          </div>
        </div>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Accent color</label>
            <input value={data.settings.accentColor} onChange={(e) => updateSetting('accentColor', e.target.value)} />
          </div>
          <div className="admin-field">
            <label>Icon color</label>
            <input value={data.settings.iconColor} onChange={(e) => updateSetting('iconColor', e.target.value)} />
          </div>
          <div className="admin-field">
            <label>Invite expiry days</label>
            <input type="number" value={data.settings.inviteExpiryDays} onChange={(e) => updateSetting('inviteExpiryDays', Number(e.target.value))} />
          </div>
          <div className="admin-field">
            <label>Max invite uses</label>
            <input type="number" value={data.settings.maxInviteUses} onChange={(e) => updateSetting('maxInviteUses', Number(e.target.value))} />
          </div>
          <div className="admin-field">
            <label>Support email</label>
            <input type="email" value={data.settings.supportEmail} onChange={(e) => updateSetting('supportEmail', e.target.value)} />
          </div>
          <div className="admin-field">
            <label>Maintenance mode</label>
            <select value={String(data.settings.maintenanceMode)} onChange={(e) => updateSetting('maintenanceMode', e.target.value === 'true')}>
              <option value="false">Off</option>
              <option value="true">On</option>
            </select>
          </div>
          <div className="admin-field">
            <label>User signup</label>
            <select value={String(data.settings.allowUserSignup)} onChange={(e) => updateSetting('allowUserSignup', e.target.value === 'true')}>
              <option value="true">Allowed</option>
              <option value="false">Disabled</option>
            </select>
          </div>
          <div className="admin-field">
            <label>HR self signup</label>
            <select value={String(data.settings.allowHrSignup)} onChange={(e) => updateSetting('allowHrSignup', e.target.value === 'true')}>
              <option value="false">Invite only</option>
              <option value="true">Allowed</option>
            </select>
          </div>
          <div className="admin-field">
            <label>HR approval</label>
            <select value={String(data.settings.requireAdminApprovalForHr)} onChange={(e) => updateSetting('requireAdminApprovalForHr', e.target.value === 'true')}>
              <option value="true">Required</option>
              <option value="false">Not required</option>
            </select>
          </div>
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-card-head">
          <div>
            <h2>Announcement bar</h2>
            <p>Control the public announcement shown above the site navigation.</p>
          </div>
        </div>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Announcement status</label>
            <select value={String(data.settings.announcementEnabled)} onChange={(e) => updateSetting('announcementEnabled', e.target.value === 'true')}>
              <option value="false">Hidden</option>
              <option value="true">Visible</option>
            </select>
          </div>
          <div className="admin-field">
            <label>Announcement text</label>
            <textarea value={data.settings.announcementText} onChange={(e) => updateSetting('announcementText', e.target.value)} />
          </div>
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-card-head">
          <div>
            <h2>HR invite template</h2>
            <p>Set defaults used when the admin emails HR teams to create profiles.</p>
          </div>
        </div>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Default invite role</label>
            <select value={data.settings.defaultInviteRole} onChange={(e) => updateSetting('defaultInviteRole', e.target.value)}>
              <option>HR Manager</option>
              <option>Recruiter</option>
              <option>Hiring Lead</option>
            </select>
          </div>
          <div className="admin-field">
            <label>Email subject</label>
            <input value={data.settings.inviteEmailSubject} onChange={(e) => updateSetting('inviteEmailSubject', e.target.value)} />
          </div>
          <div className="admin-field">
            <label>Email message</label>
            <textarea value={data.settings.inviteEmailMessage} onChange={(e) => updateSetting('inviteEmailMessage', e.target.value)} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminDashboardSettings;
