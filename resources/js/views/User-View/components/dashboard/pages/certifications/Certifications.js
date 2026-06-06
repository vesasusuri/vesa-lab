import React, { useState } from 'react';
import { FiAward, FiPlus, FiTrash2 } from 'react-icons/fi';
import '../work-experience/WorkExperience.scss';

export default function Certifications({ certifications: controlledCertifications, onCertificationsChange }) {
    const [internalCertifications, setInternalCertifications] = useState([]);
    const certifications = controlledCertifications ?? internalCertifications;
    const setCertifications = onCertificationsChange ?? setInternalCertifications;

    const handleChange = (id, field, value) => {
        setCertifications(prev => prev.map(cert => cert.id === id ? { ...cert, [field]: value } : cert));
    };

    const handleAdd = () => {
        setCertifications(prev => [...prev, { id: Date.now(), name: '', issuer: '', year: '' }]);
    };

    const handleRemove = (id) => {
        setCertifications(prev => prev.filter(cert => cert.id !== id));
    };

    return (
        <div className="work-experience">
            <div className="work-experience__header">
                <div className="work-experience__icon"><FiAward size={18} /></div>
                <div>
                    <h3 className="work-experience__title">Certifications</h3>
                    <p className="work-experience__subtitle">Review certification details extracted from your CV</p>
                </div>
            </div>
            <div className="work-experience__body">
                {certifications.map((cert) => (
                    <div key={cert.id} className="work-experience__item">
                        <div className="work-experience__row">
                            <div className="work-experience__field">
                                <label>Certification</label>
                                <input value={cert.name || ''} onChange={e => handleChange(cert.id, 'name', e.target.value)} placeholder="e.g. AWS Certified Developer" />
                            </div>
                            <div className="work-experience__field">
                                <label>Issuer</label>
                                <input value={cert.issuer || ''} onChange={e => handleChange(cert.id, 'issuer', e.target.value)} placeholder="e.g. Amazon Web Services" />
                            </div>
                        </div>
                        <div className="work-experience__field">
                            <label>Issue date / credential</label>
                            <input value={cert.year || ''} onChange={e => handleChange(cert.id, 'year', e.target.value)} placeholder="2024 or credential details" />
                        </div>
                        <button type="button" className="work-experience__remove" onClick={() => handleRemove(cert.id)}>
                            <FiTrash2 size={14} /> Remove
                        </button>
                    </div>
                ))}
                <button type="button" className="work-experience__add" onClick={handleAdd}>
                    <FiPlus size={16} /> Add certification
                </button>
            </div>
        </div>
    );
}
