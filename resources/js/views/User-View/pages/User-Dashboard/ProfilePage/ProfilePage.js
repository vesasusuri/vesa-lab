import React, { useCallback, useEffect, useState } from 'react';
import UserDashboardLayout from '../../../components/dashboard/shared/UserDashboardLayout/UserDashboardLayout';
import ProfileHero from '../../../components/dashboard/pages/profile-hero/ProfileHero';
import PersonalInfo from '../../../components/dashboard/pages/personal-info/PersonalInfo';
import AboutMe from '../../../components/dashboard/pages/about-me/AboutMe';
import SocialLinks from '../../../components/dashboard/pages/social-links/SocialLinks';
import JobPreferences from '../../../components/dashboard/pages/job-preferences/JobPreferences';
import {
  clearCandidateProfile,
  getCandidateProfile,
  saveCandidateProfile,
  uploadCandidateAvatar,
} from '../../../../../api/profileApi';
import {
  emptyProfileForm,
  formToProfilePayload,
  hasProfileErrors,
  mapApiErrorsToForm,
  profileToForm,
  validateProfileForm,
} from '../../../../../utils/profileFormUtils';
import './ProfilePage.scss';

const ProfilePage = () => {
  const [form, setForm] = useState(emptyProfileForm);
  const [savedForm, setSavedForm] = useState(emptyProfileForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');

  const applyProfile = useCallback((profile) => {
    const next = profileToForm(profile);
    setForm(next);
    setSavedForm(next);
    setErrors({});
  }, []);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getCandidateProfile();
      applyProfile(data?.profile);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load profile.');
      setForm({ ...emptyProfileForm });
      setSavedForm({ ...emptyProfileForm });
      setErrors({});
    } finally {
      setLoading(false);
    }
  }, [applyProfile]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleChange = (field, value) => {
    const next = { ...form, [field]: value };
    setForm(next);
    setErrors(validateProfileForm(next));
    setMessage('');
    setError('');
  };

  const handleAvatarSelect = async (file, clientError) => {
    if (clientError) {
      setAvatarError(clientError);
      return;
    }

    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, avatarUrl: previewUrl }));
    setAvatarUploading(true);
    setAvatarError('');
    setMessage('');
    setError('');

    try {
      const data = await uploadCandidateAvatar(file);
      applyProfile(data?.profile);
      setMessage(data?.message || 'Profile photo updated.');
    } catch (err) {
      setForm((prev) => ({ ...prev, avatarUrl: savedForm.avatarUrl ?? null }));
      const apiMessage = err?.response?.data?.errors?.avatar?.[0]
        || err?.response?.data?.message
        || 'Failed to upload profile photo.';
      setAvatarError(apiMessage);
    } finally {
      URL.revokeObjectURL(previewUrl);
      setAvatarUploading(false);
    }
  };

  const handleSave = async (e) => {
    e?.preventDefault?.();

    const validationErrors = validateProfileForm(form);
    if (hasProfileErrors(validationErrors)) {
      setErrors(validationErrors);
      setError('Please fix the highlighted fields before saving.');
      setMessage('');
      return;
    }

    setSaving(true);
    setMessage('');
    setError('');
    setErrors({});

    try {
      const data = await saveCandidateProfile(formToProfilePayload(form));
      applyProfile(data?.profile);
      setMessage(data?.message || 'Profile saved successfully.');
    } catch (err) {
      const apiErrors = mapApiErrorsToForm(err?.response?.data?.errors);
      if (hasProfileErrors(apiErrors)) {
        setErrors(apiErrors);
        setError('Please fix the highlighted fields before saving.');
      } else {
        setError(err?.response?.data?.message || 'Failed to save profile.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({ ...savedForm });
    setErrors({});
    setMessage('');
    setError('');
  };

  const handleClear = async () => {
    if (!window.confirm('Clear all profile information? Your resume sections will not be deleted.')) {
      return;
    }

    setClearing(true);
    setMessage('');
    setError('');
    setErrors({});

    try {
      const data = await clearCandidateProfile();
      applyProfile(data?.profile);
      setMessage(data?.message || 'Profile information cleared.');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to clear profile.');
    } finally {
      setClearing(false);
    }
  };

  if (loading) {
    return (
      <UserDashboardLayout>
        <div className="profile-page profile-page--loading">
          <p>Loading profile…</p>
        </div>
      </UserDashboardLayout>
    );
  }

  return (
    <UserDashboardLayout>
      <form className="profile-page" onSubmit={handleSave} noValidate>
        <ProfileHero
          form={form}
          onAvatarSelect={handleAvatarSelect}
          onAvatarImageError={() => {
            setForm((prev) => ({ ...prev, avatarUrl: null }));
            setAvatarError('Could not load profile photo. Try uploading again.');
          }}
          avatarUploading={avatarUploading}
          avatarError={avatarError}
        />
        <div className="profile-page__body">
          <div className="profile-page__left">
            <SocialLinks form={form} errors={errors} onChange={handleChange} />
          </div>
          <div className="profile-page__right">
            <PersonalInfo form={form} errors={errors} onChange={handleChange} />
            <AboutMe
              value={form.about}
              error={errors.about}
              onChange={(val) => handleChange('about', val)}
            />
            <JobPreferences form={form} errors={errors} onChange={handleChange} />
            {(message || error) && (
              <p className={`profile-page__feedback${error ? ' profile-page__feedback--error' : ''}`}>
                {error || message}
              </p>
            )}
            <div className="profile-page__actions">
              <button
                type="button"
                className="profile-page__clear"
                onClick={handleClear}
                disabled={saving || clearing}
              >
                {clearing ? 'Clearing…' : 'Clear profile'}
              </button>
              <div className="profile-page__actions-main">
                <button
                  type="button"
                  className="profile-page__cancel"
                  onClick={handleCancel}
                  disabled={saving || clearing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="profile-page__save"
                  disabled={saving || clearing}
                >
                  {saving ? 'Saving…' : '💾 Save changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </UserDashboardLayout>
  );
};

export default ProfilePage;
