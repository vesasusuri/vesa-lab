import React from 'react';
import { FiEdit2, FiMail, FiPhone, FiMapPin, FiCalendar, FiFlag } from 'react-icons/fi';
import ProfileFormField from '../shared/ProfileFormField';
import './PersonalInfo.scss';

export default function PersonalInfo({ form, errors = {}, onChange }) {
    const field = (key) => ({
        value: form[key] ?? '',
        onChange: (e) => onChange(key, e.target.value),
    });

    return (
        <div className="personal-info">
            <div className="personal-info__header">
                <div className="personal-info__icon">
                    <FiEdit2 size={18} />
                </div>
                <div>
                    <h3 className="personal-info__title">Personal information</h3>
                    <p className="personal-info__subtitle">Basic details about you</p>
                </div>
            </div>
            <div className="personal-info__body">
                <div className="personal-info__grid">
                    <ProfileFormField label="First name" error={errors.firstName} className="personal-info__field">
                        <input type="text" aria-invalid={Boolean(errors.firstName)} {...field('firstName')} />
                    </ProfileFormField>
                    <ProfileFormField label="Last name" error={errors.lastName} className="personal-info__field">
                        <input type="text" aria-invalid={Boolean(errors.lastName)} {...field('lastName')} />
                    </ProfileFormField>
                    <ProfileFormField label="Email" icon={<FiMail size={13} />} error={errors.email} className="personal-info__field">
                        <input type="email" aria-invalid={Boolean(errors.email)} {...field('email')} />
                    </ProfileFormField>
                    <ProfileFormField label="Phone" icon={<FiPhone size={13} />} error={errors.phone} className="personal-info__field">
                        <input type="tel" aria-invalid={Boolean(errors.phone)} {...field('phone')} />
                    </ProfileFormField>
                    <ProfileFormField label="Location" icon={<FiMapPin size={13} />} error={errors.location} className="personal-info__field">
                        <input type="text" aria-invalid={Boolean(errors.location)} {...field('location')} />
                    </ProfileFormField>
                    <ProfileFormField label="Date of birth" icon={<FiCalendar size={13} />} error={errors.dateOfBirth} className="personal-info__field">
                        <input type="date" aria-invalid={Boolean(errors.dateOfBirth)} {...field('dateOfBirth')} />
                    </ProfileFormField>
                    <ProfileFormField label="Nationality" icon={<FiFlag size={13} />} error={errors.nationality} className="personal-info__field">
                        <input type="text" aria-invalid={Boolean(errors.nationality)} {...field('nationality')} />
                    </ProfileFormField>
                    <ProfileFormField
                        label="Professional title"
                        error={errors.jobTitle}
                        className="personal-info__field personal-info__field--full"
                    >
                        <input
                            type="text"
                            placeholder="e.g. Senior Frontend Developer"
                            aria-invalid={Boolean(errors.jobTitle)}
                            {...field('jobTitle')}
                        />
                    </ProfileFormField>
                </div>
            </div>
        </div>
    );
}
