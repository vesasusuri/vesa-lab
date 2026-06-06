import React, { useState } from 'react';
import { FiFolder, FiPlus, FiTrash2 } from 'react-icons/fi';
import '../work-experience/WorkExperience.scss';

export default function Projects({ projects: controlledProjects, onProjectsChange }) {
    const [internalProjects, setInternalProjects] = useState([]);
    const projects = controlledProjects ?? internalProjects;
    const setProjects = onProjectsChange ?? setInternalProjects;

    const handleChange = (id, field, value) => {
        setProjects(prev => prev.map(project => project.id === id ? { ...project, [field]: value } : project));
    };

    const handleTechnologiesChange = (id, value) => {
        handleChange(id, 'technologies', value.split(',').map(item => item.trim()).filter(Boolean));
    };

    const handleAdd = () => {
        setProjects(prev => [...prev, {
            id: Date.now(),
            name: '',
            description: '',
            technologies: [],
            url: '',
            startDate: '',
            endDate: '',
        }]);
    };

    const handleRemove = (id) => {
        setProjects(prev => prev.filter(project => project.id !== id));
    };

    return (
        <div className="work-experience">
            <div className="work-experience__header">
                <div className="work-experience__icon"><FiFolder size={18} /></div>
                <div>
                    <h3 className="work-experience__title">Projects</h3>
                    <p className="work-experience__subtitle">Review project details extracted from your CV</p>
                </div>
            </div>
            <div className="work-experience__body">
                {projects.map((project) => (
                    <div key={project.id} className="work-experience__item">
                        <div className="work-experience__row">
                            <div className="work-experience__field">
                                <label>Project name</label>
                                <input value={project.name || ''} onChange={e => handleChange(project.id, 'name', e.target.value)} placeholder="e.g. Portfolio website" />
                            </div>
                            <div className="work-experience__field">
                                <label>Link</label>
                                <input value={project.url || ''} onChange={e => handleChange(project.id, 'url', e.target.value)} placeholder="https://..." />
                            </div>
                        </div>
                        <div className="work-experience__field">
                            <label>Technologies</label>
                            <input value={(project.technologies || []).join(', ')} onChange={e => handleTechnologiesChange(project.id, e.target.value)} placeholder="React, Laravel, MySQL" />
                        </div>
                        <div className="work-experience__row">
                            <div className="work-experience__field">
                                <label>Start date</label>
                                <input type="month" value={project.startDate || ''} onChange={e => handleChange(project.id, 'startDate', e.target.value)} />
                            </div>
                            <div className="work-experience__field">
                                <label>End date</label>
                                <input type="month" value={project.endDate || ''} onChange={e => handleChange(project.id, 'endDate', e.target.value)} />
                            </div>
                        </div>
                        <div className="work-experience__field">
                            <label>Description</label>
                            <textarea rows={3} value={project.description || ''} onChange={e => handleChange(project.id, 'description', e.target.value)} placeholder="What does this project do?" />
                        </div>
                        <button type="button" className="work-experience__remove" onClick={() => handleRemove(project.id)}>
                            <FiTrash2 size={14} /> Remove
                        </button>
                    </div>
                ))}
                <button type="button" className="work-experience__add" onClick={handleAdd}>
                    <FiPlus size={16} /> Add project
                </button>
            </div>
        </div>
    );
}
