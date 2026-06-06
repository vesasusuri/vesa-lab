import React, { useEffect, useState } from 'react';
import { fetchHrSettings, saveHrSettings, saveHrAccount, saveHrNotifications } from '../../../../../api/hrApi';
import './HireDashboardSettings.scss';

const DEFAULT_PROFILE = {
  company_name: localStorage.getItem('user_company') || 'Your Company',
  industry:    'Technology',
  size:        '11–50',
  location:    '',
  website:     '',
  description: '',
};

const HireDashboardSettings = () => {
  const [profile,      setProfile]      = useState(DEFAULT_PROFILE);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);

  const [account,      setAccount]      = useState({
    email:           localStorage.getItem('user_email') || '',
    currentPassword: '',
    newPassword:     '',
  });
  const [accountSaved,  setAccountSaved]  = useState(false);
  const [accountSaving, setAccountSaving] = useState(false);
  const [accountError,  setAccountError]  = useState('');

  const DEFAULT_NOTIFICATIONS = {
    newApplication:    true,
    interviewReminder: true,
    weeklyDigest:      false,
    marketingEmails:   false,
  };

  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);

useEffect(() => {
    fetchHrSettings()
      .then((data) => {
        if (data && data.company_name) {
          setProfile({
            company_name: data.company_name || DEFAULT_PROFILE.company_name,
            industry:     data.industry     || DEFAULT_PROFILE.industry,
            size:         data.size         || DEFAULT_PROFILE.size,
            location:     data.location     || '',
            website:      data.website      || '',
            description:  data.description  || '',
          });
        }
        if (data && data.notifications) {
          setNotifications({ ...DEFAULT_NOTIFICATIONS, ...data.notifications });
        }
      })
      .catch(() => {});
  }, []);

  const handleProfileChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });
  const handleAccountChange = (e) => setAccount({ ...account, [e.target.name]: e.target.value });

  const saveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      await saveHrSettings(profile);
      localStorage.setItem('user_company', profile.company_name);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    } catch {
      
    } finally {
      setProfileSaving(false);
    }
  };

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    setAccountError('');
    setAccountSaving(true);
    try {
      await saveHrAccount({
        email:        account.email || undefined,
        new_password: account.newPassword || undefined,
      });
      setAccountSaved(true);
      setAccount((prev) => ({ ...prev, currentPassword: '', newPassword: '' }));
      setTimeout(() => setAccountSaved(false), 2000);
    } catch (err) {
      setAccountError(err?.response?.data?.message || 'Could not update account.');
    } finally {
      setAccountSaving(false);
    }
  };

  const initials = profile.company_name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <section className="hire-settings-section">
      <div className="hire-settings-wrapper">

        <div className="hire-settings-header">
          <h1>Settings</h1>
          <p>Manage your company profile and account preferences.</p>
        </div>

        {/* Company Profile */}
        <div className="hire-settings-block">
          <div className="hire-settings-block-header">
            <h2>Company Profile</h2>
            <p>This information appears on your job listings.</p>
          </div>

          <div className="hire-settings-avatar-row">
            <div className="hire-settings-avatar">{initials}</div>
            <div>
              <p className="hire-settings-avatar-name">{profile.company_name}</p>
              <p className="hire-settings-avatar-sub">Hiring Team</p>
            </div>
          </div>

          <form className="hire-settings-form" onSubmit={saveProfile}>
            <div className="hire-settings-row">
              <div className="hire-settings-field">
                <label>Company Name</label>
                <input name="company_name" value={profile.company_name} onChange={handleProfileChange} />
              </div>
              <div className="hire-settings-field">
                <label>Industry</label>
                <select name="industry" value={profile.industry} onChange={handleProfileChange}>
                  <option>Technology</option>
                  <option>Finance</option>
                  <option>Healthcare</option>
                  <option>Education</option>
                  <option>Marketing</option>
                  <option>Design</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div className="hire-settings-row">
              <div className="hire-settings-field">
                <label>Company Size</label>
                <select name="size" value={profile.size} onChange={handleProfileChange}>
                  <option>1–10</option>
                  <option>11–50</option>
                  <option>51–200</option>
                  <option>201–500</option>
                  <option>500+</option>
                </select>
              </div>
              <div className="hire-settings-field">
                <label>Location</label>
                <input name="location" value={profile.location} onChange={handleProfileChange} />
              </div>
            </div>
            <div className="hire-settings-field">
              <label>Website</label>
              <input name="website" value={profile.website} onChange={handleProfileChange} />
            </div>
            <div className="hire-settings-field">
              <label>Company Description</label>
              <textarea name="description" value={profile.description} onChange={handleProfileChange} rows={3} />
            </div>
            <button type="submit" className="hire-settings-save" disabled={profileSaving}>
              {profileSaved ? '✓ Saved!' : profileSaving ? 'Saving…' : 'Save Profile'}
            </button>
          </form>
        </div>

        {}
        <div className="hire-settings-block">
          <div className="hire-settings-block-header">
            <h2>Account</h2>
            <p>Update your login credentials.</p>
          </div>
          <form className="hire-settings-form" onSubmit={handleAccountSubmit}>
            <div className="hire-settings-field">
              <label>Email Address</label>
              <input name="email" type="email" value={account.email} onChange={handleAccountChange} />
            </div>
            <div className="hire-settings-divider" />
            <div className="hire-settings-row">
              <div className="hire-settings-field">
                <label>Current Password</label>
                <input name="currentPassword" type="password" value={account.currentPassword} onChange={handleAccountChange} placeholder="••••••••" />
              </div>
              <div className="hire-settings-field">
                <label>New Password</label>
                <input name="newPassword" type="password" value={account.newPassword} onChange={handleAccountChange} placeholder="••••••••" />
              </div>
            </div>
            {accountError && <p style={{ color: '#c0392b', fontSize: 13 }}>{accountError}</p>}
            <button type="submit" className="hire-settings-save" disabled={accountSaving}>
              {accountSaved ? '✓ Updated!' : accountSaving ? 'Saving…' : 'Update Account'}
            </button>
          </form>
        </div>

        {}
        <div className="hire-settings-block">
          <div className="hire-settings-block-header">
            <h2>Notifications</h2>
            <p>Choose what you want to be notified about.</p>
          </div>
          <div className="hire-settings-toggles">
            {[
              { key: 'newApplication',    label: 'New Application',    sub: 'Get notified when someone applies to your job' },
              { key: 'interviewReminder', label: 'Interview Reminders', sub: 'Reminders 1 hour before a scheduled interview' },
              { key: 'weeklyDigest',      label: 'Weekly Digest',       sub: 'Summary of your hiring activity every Monday' },
              { key: 'marketingEmails',   label: 'Product Updates',     sub: 'News about new BEE HIRED features' },
            ].map(({ key, label, sub }) => (
              <div key={key} className="hire-settings-toggle-row">
                <div>
                  <p className="hire-settings-toggle-label">{label}</p>
                  <p className="hire-settings-toggle-sub">{sub}</p>
                </div>
                <button
                  className={`hire-toggle${notifications[key] ? ' on' : ''}`}
                  onClick={() => {
                    const updated = { ...notifications, [key]: !notifications[key] };
                    setNotifications(updated);
                    saveHrNotifications(updated).catch(() => {});
                  }}
                  type="button"
                >
                  <span className="hire-toggle-knob" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {}
        <div className="hire-settings-block hire-settings-block--danger">
          <div className="hire-settings-block-header">
            <h2>Danger Zone</h2>
            <p>These actions are permanent and cannot be undone.</p>
          </div>
          <div className="hire-danger-row">
            <div>
              <p className="hire-danger-label">Sign out of all devices</p>
              <p className="hire-danger-sub">Ends all active sessions for this account.</p>
            </div>
            <button className="hire-danger-btn" type="button">Sign Out All</button>
          </div>
          <div className="hire-danger-row">
            <div>
              <p className="hire-danger-label">Delete company account</p>
              <p className="hire-danger-sub">Permanently removes all data and job listings.</p>
            </div>
            <button className="hire-danger-btn hire-danger-btn--red" type="button">Delete Account</button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HireDashboardSettings;
