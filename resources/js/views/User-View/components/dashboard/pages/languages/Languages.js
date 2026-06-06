import React, { useState } from 'react';
import { FiGlobe, FiPlus, FiTrash2 } from 'react-icons/fi';
import './Languages.scss';

const LEVELS = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'];

const initialLanguages = [
    { id: 1, language: 'Albanian', level: 'Native' },
    { id: 2, language: 'English', level: 'Fluent' },
];

export default function Languages({ languages: controlledLanguages, onLanguagesChange }) {
    const [internalLanguages, setInternalLanguages] = useState(initialLanguages);
    const languages = controlledLanguages ?? internalLanguages;
    const setLanguages = onLanguagesChange ?? setInternalLanguages;

    const handleChange = (id, field, value) => {
        setLanguages(prev =>
            prev.map(l => l.id === id ? { ...l, [field]: value } : l)
        );
    };

    const handleAdd = () => {
        setLanguages(prev => [...prev, {
            id: Date.now(),
            language: '',
            level: 'Fluent',
        }]);
    };

    const handleRemove = (id) => {
        setLanguages(prev => prev.filter(l => l.id !== id));
    };

    return (
        <div className="languages">
            <div className="languages__header">
                <div className="languages__icon"><FiGlobe size={18} /></div>
                <div>
                    <h3 className="languages__title">Languages</h3>
                    <p className="languages__subtitle">Languages you speak</p>
                </div>
            </div>
            <div className="languages__body">
                {languages.map(l => (
                    <div key={l.id} className="languages__item">
                        <div className="languages__field">
                            <label>Language</label>
                            <input
                                type="text"
                                value={l.language}
                                onChange={e => handleChange(l.id, 'language', e.target.value)}
                                placeholder="e.g. English"
                            />
                        </div>
                        <div className="languages__field">
                            <label>Level</label>
                            <select
                                value={l.level}
                                onChange={e => handleChange(l.id, 'level', e.target.value)}
                            >
                                {LEVELS.map(lv => <option key={lv}>{lv}</option>)}
                            </select>
                        </div>
                        <button className="languages__remove" onClick={() => handleRemove(l.id)}>
                            <FiTrash2 size={16} />
                        </button>
                    </div>
                ))}
                <button className="languages__add" onClick={handleAdd}>
                    <FiPlus size={16} /> Add language
                </button>
            </div>
        </div>
    );
}