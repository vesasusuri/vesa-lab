import React from 'react';
import { FiGithub } from 'react-icons/fi';
import '../work-experience/WorkExperience.scss';

export default function GitHubProfile({ github, onGithubChange }) {
    const value = github || { profileUrl: '', repositories: [], portfolioLinks: [] };

    const update = (field, fieldValue) => {
        onGithubChange?.({ ...value, [field]: fieldValue });
    };

    const updateList = (field, fieldValue) => {
        update(field, fieldValue.split('\n').map(item => item.trim()).filter(Boolean));
    };

    return (
        <div className="work-experience">
            <div className="work-experience__header">
                <div className="work-experience__icon"><FiGithub size={18} /></div>
                <div>
                    <h3 className="work-experience__title">GitHub Profile</h3>
                    <p className="work-experience__subtitle">Review GitHub and portfolio links found in your CV</p>
                </div>
            </div>
            <div className="work-experience__body">
                <div className="work-experience__item">
                    <div className="work-experience__field">
                        <label>GitHub profile URL</label>
                        <input value={value.profileUrl || ''} onChange={e => update('profileUrl', e.target.value)} placeholder="https://github.com/username" />
                    </div>
                    <div className="work-experience__field">
                        <label>Repositories</label>
                        <textarea rows={4} value={(value.repositories || []).join('\n')} onChange={e => updateList('repositories', e.target.value)} placeholder="One repository link or name per line" />
                    </div>
                    <div className="work-experience__field">
                        <label>Portfolio links</label>
                        <textarea rows={4} value={(value.portfolioLinks || []).join('\n')} onChange={e => updateList('portfolioLinks', e.target.value)} placeholder="One portfolio link per line" />
                    </div>
                </div>
            </div>
        </div>
    );
}
