import React, { useEffect, useState } from 'react';
import { FiDownload, FiEye, FiLayout } from 'react-icons/fi';
import { exportCvPdf, getCvTemplates } from '../../../../../../api/resumeApi';
import './ResumeTemplates.scss';

export default function ResumeTemplates({ disabled = false }) {
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState('modern');
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getCvTemplates()
      .then((data) => {
        const list = data.templates || [];
        setTemplates(list);
        if (list.length) setSelected(list[0].slug);
      })
      .catch(() => setMessage('Could not load templates.'));
  }, []);

  const handlePreview = () => {
    if (!selected) return;
    window.open(`/api/cv/preview/${selected}`, '_blank', 'noopener,noreferrer');
  };

  const readBlobError = async (error) => {
    const data = error?.response?.data;
    if (!(data instanceof Blob)) {
      return error?.response?.data?.message || null;
    }

    try {
      const text = await data.text();
      const parsed = JSON.parse(text);
      return parsed.message || parsed.error || null;
    } catch {
      return null;
    }
  };

  const handleExport = async () => {
    if (!selected || disabled) return;
    setExporting(true);
    setMessage('');
    try {
      const response = await exportCvPdf(selected);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cv-${selected}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      setMessage('PDF downloaded successfully.');
    } catch (err) {
      const errorMessage = await readBlobError(err);
      setMessage(errorMessage || 'PDF export failed. Save your profile first.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <section className="resume-templates" aria-label="CV templates and export">
      <div className="resume-templates__header">
        <div className="resume-templates__icon"><FiLayout size={18} /></div>
        <div>
          <h3 className="resume-templates__title">Templates & export</h3>
          <p className="resume-templates__subtitle">Generate your CV from saved data using a template</p>
        </div>
      </div>
      <div className="resume-templates__body">
        <div className="resume-templates__grid">
          {templates.map((t) => (
            <button
              key={t.slug}
              type="button"
              className={`resume-templates__card${selected === t.slug ? ' resume-templates__card--active' : ''}`}
              onClick={() => setSelected(t.slug)}
              disabled={disabled}
            >
              <span className="resume-templates__card-name">{t.name}</span>
              <span className="resume-templates__card-desc">{t.description}</span>
            </button>
          ))}
        </div>
        <div className="resume-templates__actions">
          <button
            type="button"
            className="resume-templates__btn resume-templates__btn--outline"
            onClick={handlePreview}
            disabled={!selected || disabled}
          >
            <FiEye size={16} aria-hidden="true" />
            Preview
          </button>
          <button
            type="button"
            className="resume-templates__btn resume-templates__btn--primary"
            onClick={handleExport}
            disabled={!selected || disabled || exporting}
          >
            <FiDownload size={16} aria-hidden="true" />
            {exporting ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
        {message && <p className="resume-templates__message">{message}</p>}
      </div>
    </section>
  );
}
