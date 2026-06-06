import React, { useState } from 'react';
import { FiUpload, FiFile, FiX, FiLoader } from 'react-icons/fi';
import './ResumeUpload.scss';

const MAX_SIZE_KB = 5120;

export default function ResumeUpload({
  file,
  onFileSelect,
  loading = false,
  loadingMessage = '',
}) {
    const [dragging, setDragging] = useState(false);
    const [localError, setLocalError] = useState('');

    const validateAndSelect = (selectedFile) => {
        setLocalError('');

        if (!selectedFile) {
            return;
        }

        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
        ];
        const allowedExtensions = ['.pdf', '.doc', '.docx'];
        const extension = selectedFile.name.includes('.')
            ? selectedFile.name.slice(selectedFile.name.lastIndexOf('.')).toLowerCase()
            : '';

        if (!allowedTypes.includes(selectedFile.type) && !allowedExtensions.includes(extension)) {
            setLocalError('Only PDF or Word (.docx) files are allowed.');
            return;
        }

        if (selectedFile.size > MAX_SIZE_KB * 1024) {
            setLocalError(`File must be smaller than ${MAX_SIZE_KB / 1024} MB.`);
            return;
        }

        onFileSelect?.(selectedFile);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        validateAndSelect(e.dataTransfer.files[0]);
    };

    const handleChange = (e) => {
        validateAndSelect(e.target.files[0]);
    };

    const handleRemove = () => {
        setLocalError('');
        onFileSelect?.(null);
    };

    return (
        <div className="resume-upload">
            <div className="resume-upload__header">
                <div className="resume-upload__icon"><FiUpload size={18} /></div>
                <div>
                    <h3 className="resume-upload__title">Resume / CV</h3>
                    <p className="resume-upload__subtitle">Upload your latest resume (PDF or DOCX, max 5MB)</p>
                </div>
            </div>
            <div className="resume-upload__body">
                {loading && (
                    <div className="resume-upload__analyzing">
                        <FiLoader className="resume-upload__spinner" aria-hidden="true" />
                        <span>{loadingMessage || 'Recalculating your score with AI…'}</span>
                    </div>
                )}

                {localError && (
                    <p className="resume-upload__error" role="alert">{localError}</p>
                )}

                {file ? (
                    <div className="resume-upload__file">
                        <FiFile size={20} />
                        <div className="resume-upload__file-info">
                            <span className="resume-upload__file-name">{file.name}</span>
                            <span className="resume-upload__file-size">{(file.size / 1024).toFixed(1)} KB</span>
                        </div>
                        {!loading && (
                            <button type="button" className="resume-upload__remove" onClick={handleRemove}>
                                <FiX size={16} />
                            </button>
                        )}
                    </div>
                ) : (
                    <div
                        className={`resume-upload__drop ${dragging ? 'resume-upload__drop--active' : ''}`}
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => !loading && document.getElementById('resume-input').click()}
                        onKeyDown={(e) => e.key === 'Enter' && !loading && document.getElementById('resume-input').click()}
                        role="button"
                        tabIndex={0}
                    >
                        <FiUpload size={28} />
                        <p>Drag and drop your CV here or <span>browse</span></p>
                        <input
                            id="resume-input"
                            type="file"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={handleChange}
                            style={{ display: 'none' }}
                            disabled={loading}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
