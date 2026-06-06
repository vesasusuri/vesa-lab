import React from 'react';
import { FiBriefcase, FiDollarSign, FiClock, FiMonitor } from 'react-icons/fi';
import ProfileFormField from '../shared/ProfileFormField';
import { PROFILE_AVAILABILITY_OPTIONS, PROFILE_JOB_TYPES } from '../../../../../../utils/profileFormUtils';
import './JobPreferences.scss';

export default function JobPreferences({ form, errors = {}, onChange }) {
    return (
        <div className="job-preferences">
            <div className="job-preferences__header">
                <div className="job-preferences__icon">
                    <FiBriefcase size={18} />
                </div>
                <div>
                    <h3 className="job-preferences__title">Job preferences</h3>
                    <p className="job-preferences__subtitle">What you're looking for</p>
                </div>
            </div>
            <div className="job-preferences__body">
                <div className="job-preferences__badges">
                    {form.jobType && (
                        <span className="job-preferences__badge">
                            <FiMonitor size={12} /> {form.jobType}
                        </span>
                    )}
                    {form.expectedSalary && !errors.expectedSalary && (
                        <span className="job-preferences__badge">
                            ${Number(form.expectedSalary).toLocaleString()}+ / yr
                        </span>
                    )}
                    {form.availability && (
                        <span className="job-preferences__badge job-preferences__badge--outline">
                            {form.availability}
                        </span>
                    )}
                </div>
                <div className="job-preferences__grid">
                    <ProfileFormField
                        label="Desired role"
                        icon={<FiBriefcase size={13} />}
                        error={errors.desiredRole}
                        className="job-preferences__field"
                    >
                        <input
                            type="text"
                            value={form.desiredRole ?? ''}
                            onChange={(e) => onChange('desiredRole', e.target.value)}
                            placeholder="e.g. Senior Frontend Developer"
                            aria-invalid={Boolean(errors.desiredRole)}
                        />
                    </ProfileFormField>
                    <ProfileFormField label="Job type" error={errors.jobType} className="job-preferences__field">
                        <select
                            value={form.jobType ?? ''}
                            onChange={(e) => onChange('jobType', e.target.value)}
                            aria-invalid={Boolean(errors.jobType)}
                        >
                            {PROFILE_JOB_TYPES.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </ProfileFormField>
                    <ProfileFormField
                        label="Expected salary (USD/yr)"
                        icon={<FiDollarSign size={13} />}
                        error={errors.expectedSalary}
                        className="job-preferences__field"
                    >
                        <input
                            type="number"
                            min="0"
                            step="1"
                            value={form.expectedSalary ?? ''}
                            onChange={(e) => onChange('expectedSalary', e.target.value)}
                            placeholder="45000"
                            aria-invalid={Boolean(errors.expectedSalary)}
                        />
                    </ProfileFormField>
                    <ProfileFormField label="Availability" icon={<FiClock size={13} />} error={errors.availability} className="job-preferences__field">
                        <select
                            value={form.availability ?? ''}
                            onChange={(e) => onChange('availability', e.target.value)}
                            aria-invalid={Boolean(errors.availability)}
                        >
                            {PROFILE_AVAILABILITY_OPTIONS.map((a) => (
                                <option key={a} value={a}>{a}</option>
                            ))}
                        </select>
                    </ProfileFormField>
                </div>
            </div>
        </div>
    );
}
