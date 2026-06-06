import React from 'react';
import { FiStar } from 'react-icons/fi';
import ProfileFormField from '../shared/ProfileFormField';
import { PROFILE_ABOUT_MAX } from '../../../../../../utils/profileFormUtils';
import './AboutMe.scss';

export default function AboutMe({ value, error, onChange }) {
    const length = value?.length ?? 0;

    return (
        <div className="about-me">
            <div className="about-me__header">
                <div className="about-me__icon">
                    <FiStar size={18} />
                </div>
                <div>
                    <h3 className="about-me__title">About me</h3>
                    <p className="about-me__subtitle">A short intro for recruiters (min. 20 characters)</p>
                </div>
            </div>
            <div className="about-me__body">
                <ProfileFormField error={error}>
                    <textarea
                        className="about-me__textarea"
                        rows={5}
                        maxLength={PROFILE_ABOUT_MAX}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Write a short bio..."
                        aria-invalid={Boolean(error)}
                    />
                </ProfileFormField>
                <span className={`about-me__count${error ? ' about-me__count--error' : ''}`}>
                    {length}/{PROFILE_ABOUT_MAX}
                </span>
            </div>
        </div>
    );
}
