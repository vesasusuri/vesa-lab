import React, { useState } from 'react';
import { FiCode, FiX, FiPlus } from 'react-icons/fi';
import './Skills.scss';

const initialSkills = ['React', 'JavaScript', 'Node.js', 'Laravel', 'MySQL', 'Git'];

export default function Skills({ skills: controlledSkills, onSkillsChange }) {
    const [internalSkills, setInternalSkills] = useState(initialSkills);
    const skills = controlledSkills ?? internalSkills;
    const setSkills = onSkillsChange ?? setInternalSkills;
    const [input, setInput] = useState('');

    const handleAdd = () => {
        const trimmed = input.trim();
        if (trimmed && !skills.includes(trimmed)) {
            setSkills(prev => [...prev, trimmed]);
            setInput('');
        }
    };

    const handleRemove = (skill) => {
        setSkills(prev => prev.filter(s => s !== skill));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <div className="skills">
            <div className="skills__header">
                <div className="skills__icon"><FiCode size={18} /></div>
                <div>
                    <h3 className="skills__title">Skills</h3>
                    <p className="skills__subtitle">Highlight your top skills and expertise</p>
                </div>
            </div>
            <div className="skills__body">
                <div className="skills__tags">
                    {skills.map(skill => (
                        <span key={skill} className="skills__tag">
                            {skill}
                            <button type="button" onClick={() => handleRemove(skill)} aria-label={`Remove ${skill}`}>
                                <FiX size={12} />
                            </button>
                        </span>
                    ))}
                </div>
                <div className="skills__input-wrap">
                    <input
                        type="text"
                        placeholder="Add a skill..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button type="button" className="skills__add-btn" onClick={handleAdd} aria-label="Add skill">
                        <FiPlus size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}