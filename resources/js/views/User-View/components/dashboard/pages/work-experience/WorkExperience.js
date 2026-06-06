import React, { useState } from 'react';
import { FiBriefcase, FiPlus, FiTrash2 } from 'react-icons/fi';
import { normalizeExperience } from '../../../../../../utils/formFieldUtils';
import './WorkExperience.scss';

const initialExperiences = [
    {
        id: 1,
        company: 'Tech Co.',
        role: 'Frontend Developer',
        startDate: '2023-01',
        endDate: '',
        current: true,
        description: 'Built and maintained React applications.',
    },
];

export default function WorkExperience({ experiences: controlledExperiences, onExperiencesChange }) {
    const [internalExperiences, setInternalExperiences] = useState(initialExperiences);
    const experiences = (controlledExperiences ?? internalExperiences).map((exp, index) =>
        normalizeExperience(exp, index)
    );
    const setExperiences = onExperiencesChange ?? setInternalExperiences;

    const handleChange = (id, field, value) => {
        setExperiences(prev =>
            prev.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
        );
    };

    const handleAdd = () => {
        setExperiences(prev => [...prev, {
            id: Date.now(),
            company: '',
            role: '',
            startDate: '',
            endDate: '',
            current: false,
            description: '',
        }]);
    };

    const handleRemove = (id) => {
        setExperiences(prev => prev.filter(exp => exp.id !== id));
    };

    return (
        <div className="work-experience">
            <div className="work-experience__header">
                <div className="work-experience__icon"><FiBriefcase size={18} /></div>
                <div>
                    <h3 className="work-experience__title">Work experience</h3>
                    <p className="work-experience__subtitle">Add, edit, or remove your work experience</p>
                </div>
            </div>
            <div className="work-experience__body">
                {experiences.map((exp, index) => (
                    <div key={exp.id} className="work-experience__item">
                        {index > 0 && <div className="work-experience__divider" />}
                        <div className="work-experience__row">
                            <div className="work-experience__field">
                                <label>Company</label>
                                <input
                                    type="text"
                                    value={exp.company}
                                    onChange={e => handleChange(exp.id, 'company', e.target.value)}
                                    placeholder="e.g. Tech Co."
                                />
                            </div>
                            <div className="work-experience__field">
                                <label>Role</label>
                                <input
                                    type="text"
                                    value={exp.role}
                                    onChange={e => handleChange(exp.id, 'role', e.target.value)}
                                    placeholder="e.g. Frontend Developer"
                                />
                            </div>
                        </div>
                        <div className="work-experience__row">
                            <div className="work-experience__field">
                                <label>Start date</label>
                                <input
                                    type="month"
                                    value={exp.startDate}
                                    onChange={e => handleChange(exp.id, 'startDate', e.target.value)}
                                />
                            </div>
                            <div className="work-experience__field">
                                <label>End date</label>
                                <input
                                    type="month"
                                    value={exp.endDate}
                                    onChange={e => handleChange(exp.id, 'endDate', e.target.value)}
                                    disabled={exp.current}
                                />
                            </div>
                        </div>
                        <div className="work-experience__current">
                            <input
                                type="checkbox"
                                id={`current-${exp.id}`}
                                checked={exp.current}
                                onChange={e => handleChange(exp.id, 'current', e.target.checked)}
                            />
                            <label htmlFor={`current-${exp.id}`}>I currently work here</label>
                        </div>
                        <div className="work-experience__field">
                            <label>Description</label>
                            <textarea
                                rows={3}
                                value={exp.description}
                                onChange={e => handleChange(exp.id, 'description', e.target.value)}
                                placeholder="What did you do there?"
                            />
                        </div>
                        <button className="work-experience__remove" onClick={() => handleRemove(exp.id)}>
                            <FiTrash2 size={14} /> Remove
                        </button>
                    </div>
                ))}
                <button className="work-experience__add" onClick={handleAdd}>
                    <FiPlus size={16} /> Add experience
                </button>
            </div>
        </div>
    );
}