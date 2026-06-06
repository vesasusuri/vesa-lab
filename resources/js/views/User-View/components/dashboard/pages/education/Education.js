import React, { useState } from 'react';
import { FiBookOpen, FiPlus, FiTrash2 } from 'react-icons/fi';
import { normalizeEducation } from '../../../../../../utils/formFieldUtils';
import './Education.scss';

const initialEducation = [
    {
        id: 1,
        school: 'University of Prishtina',
        degree: 'BSc Computer Science',
        fieldOfStudy: 'Computer Science',
        startDate: '2018-09',
        endDate: '2022-06',
        current: false,
    },
];

export default function Education({ education: controlledEducation, onEducationChange }) {
    const [internalEducation, setInternalEducation] = useState(initialEducation);
    const education = (controlledEducation ?? internalEducation).map((edu, index) =>
        normalizeEducation(edu, index)
    );
    const setEducation = onEducationChange ?? setInternalEducation;

    const handleChange = (id, field, value) => {
        setEducation(prev =>
            prev.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
        );
    };

    const handleAdd = () => {
        setEducation(prev => [...prev, {
            id: Date.now(),
            school: '',
            degree: '',
            fieldOfStudy: '',
            startDate: '',
            endDate: '',
            current: false,
        }]);
    };

    const handleRemove = (id) => {
        setEducation(prev => prev.filter(edu => edu.id !== id));
    };

    return (
        <div className="education">
            <div className="education__header">
                <div className="education__icon"><FiBookOpen size={18} /></div>
                <div>
                    <h3 className="education__title">Education</h3>
                    <p className="education__subtitle">Add, edit, or remove your education history</p>
                </div>
            </div>
            <div className="education__body">
                {education.map((edu, index) => (
                    <div key={edu.id} className="education__item">
                        {index > 0 && <div className="education__divider" />}
                        <div className="education__row">
                            <div className="education__field">
                                <label>School</label>
                                <input
                                    type="text"
                                    value={edu.school}
                                    onChange={e => handleChange(edu.id, 'school', e.target.value)}
                                    placeholder="e.g. University of Prishtina"
                                />
                            </div>
                            <div className="education__field">
                                <label>Degree</label>
                                <input
                                    type="text"
                                    value={edu.degree}
                                    onChange={e => handleChange(edu.id, 'degree', e.target.value)}
                                    placeholder="e.g. BSc Computer Science"
                                />
                            </div>
                        </div>
                        <div className="education__field">
                            <label>Field of study</label>
                            <input
                                type="text"
                                value={edu.fieldOfStudy || ''}
                                onChange={e => handleChange(edu.id, 'fieldOfStudy', e.target.value)}
                                placeholder="e.g. Computer Science"
                            />
                        </div>
                        <div className="education__row">
                            <div className="education__field">
                                <label>Start date</label>
                                <input
                                    type="month"
                                    value={edu.startDate}
                                    onChange={e => handleChange(edu.id, 'startDate', e.target.value)}
                                />
                            </div>
                            <div className="education__field">
                                <label>End date</label>
                                <input
                                    type="month"
                                    value={edu.endDate}
                                    onChange={e => handleChange(edu.id, 'endDate', e.target.value)}
                                    disabled={edu.current}
                                />
                            </div>
                        </div>
                        <div className="education__current">
                            <input
                                type="checkbox"
                                id={`current-edu-${edu.id}`}
                                checked={edu.current}
                                onChange={e => handleChange(edu.id, 'current', e.target.checked)}
                            />
                            <label htmlFor={`current-edu-${edu.id}`}>I currently study here</label>
                        </div>
                        <button className="education__remove" onClick={() => handleRemove(edu.id)}>
                            <FiTrash2 size={14} /> Remove
                        </button>
                    </div>
                ))}
                <button className="education__add" onClick={handleAdd}>
                    <FiPlus size={16} /> Add education
                </button>
            </div>
        </div>
    );
}
