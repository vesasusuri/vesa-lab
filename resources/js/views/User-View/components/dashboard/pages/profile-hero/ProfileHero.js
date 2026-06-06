import React, { useRef } from 'react';
import { FiCamera, FiMapPin, FiMail } from 'react-icons/fi';
import './ProfileHero.scss';

const ACCEPTED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function ProfileHero({
    form,
    onAvatarSelect,
    onAvatarImageError,
    avatarUploading = false,
    avatarError = '',
}) {
    const fileInputRef = useRef(null);
    const initials = `${form.firstName?.[0] ?? ''}${form.lastName?.[0] ?? ''}`.toUpperCase() || '?';
    const showImage = Boolean(form.avatarUrl);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;

        if (!ACCEPTED_AVATAR_TYPES.includes(file.type)) {
            onAvatarSelect?.(null, 'Use a JPG, PNG, or WebP image.');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            onAvatarSelect?.(null, 'Image must be 2 MB or smaller.');
            return;
        }

        onAvatarSelect?.(file, '');
    };

    return (
        <div className="profile-hero">
            <div className="profile-hero__banner" />
            <div className="profile-hero__card">
                <div className="profile-hero__avatar-wrap">
                    <div
                        className={`profile-hero__avatar${showImage ? ' profile-hero__avatar--image' : ''}`}
                    >
                        {!showImage && <span className="profile-hero__avatar-initials">{initials}</span>}
                        {showImage && (
                            <img
                                src={form.avatarUrl}
                                alt=""
                                className="profile-hero__avatar-img"
                                onError={() => onAvatarImageError?.()}
                            />
                        )}
                    </div>
                    <button
                        type="button"
                        className="profile-hero__camera"
                        aria-label="Upload profile photo"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={avatarUploading}
                    >
                        <FiCamera size={14} />
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="profile-hero__file-input"
                        onChange={handleFileChange}
                        tabIndex={-1}
                    />
                </div>
                <div className="profile-hero__info">
                    <h2 className="profile-hero__name">
                        {form.firstName} {form.lastName}
                        <span className="profile-hero__verified">✔</span>
                    </h2>
                    <p className="profile-hero__title">{form.jobTitle || 'Add your professional title'}</p>
                    <p className="profile-hero__meta">
                        <FiMapPin size={13} />
                        <span>{form.location || 'Location'}</span>
                        <span className="profile-hero__dot">•</span>
                        <FiMail size={13} />
                        <span>{form.email || 'Email'}</span>
                    </p>
                    {(avatarUploading || avatarError) && (
                        <p
                            className={`profile-hero__avatar-status${avatarError ? ' profile-hero__avatar-status--error' : ''}`}
                        >
                            {avatarError || 'Uploading photo…'}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
