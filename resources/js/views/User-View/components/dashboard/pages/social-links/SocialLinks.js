import React from 'react';
import { FiLinkedin, FiGithub, FiGlobe } from 'react-icons/fi';
import ProfileFormField from '../shared/ProfileFormField';
import './SocialLinks.scss';

export default function SocialLinks({ form, errors = {}, onChange }) {
    const field = (key) => ({
        value: form[key] ?? '',
        onChange: (e) => onChange(key, e.target.value),
    });

    return (
        <div className="social-links">
            <div className="social-links__header">
                <div className="social-links__icon">
                    <FiGlobe size={18} />
                </div>
                <div>
                    <h3 className="social-links__title">Social links</h3>
                    <p className="social-links__subtitle">Where can people find you online</p>
                </div>
            </div>
            <div className="social-links__body">
                <ProfileFormField
                    label="LinkedIn"
                    icon={<FiLinkedin size={13} />}
                    error={errors.linkedin}
                    className="social-links__field"
                >
                    <input
                        type="text"
                        placeholder="linkedin.com/in/yourname"
                        aria-invalid={Boolean(errors.linkedin)}
                        {...field('linkedin')}
                    />
                </ProfileFormField>
                <ProfileFormField
                    label="GitHub"
                    icon={<FiGithub size={13} />}
                    error={errors.github}
                    className="social-links__field"
                >
                    <input
                        type="text"
                        placeholder="github.com/yourname"
                        aria-invalid={Boolean(errors.github)}
                        {...field('github')}
                    />
                </ProfileFormField>
                <ProfileFormField
                    label="Portfolio"
                    icon={<FiGlobe size={13} />}
                    error={errors.portfolio}
                    className="social-links__field"
                >
                    <input
                        type="text"
                        placeholder="yoursite.com"
                        aria-invalid={Boolean(errors.portfolio)}
                        {...field('portfolio')}
                    />
                </ProfileFormField>
            </div>
        </div>
    );
}
