import React, { useCallback, useEffect, useState } from 'react';
import { FiAward, FiBookOpen, FiBriefcase, FiCode, FiFolder, FiGithub, FiGlobe, FiSave } from 'react-icons/fi';
import UserDashboardLayout from '../../../components/dashboard/shared/UserDashboardLayout/UserDashboardLayout';
import ResumeUpload from '../../../components/dashboard/pages/resume-upload/ResumeUpload';
import ResumeAIInsights from '../../../components/dashboard/pages/resume-ai-insights/ResumeAIInsights';
import ResumeTemplates from '../../../components/dashboard/pages/resume-templates/ResumeTemplates';
import Skills from '../../../components/dashboard/pages/skills/Skills';
import WorkExperience from '../../../components/dashboard/pages/work-experience/WorkExperience';
import Education from '../../../components/dashboard/pages/education/Education';
import Languages from '../../../components/dashboard/pages/languages/Languages';
import Projects from '../../../components/dashboard/pages/projects/Projects';
import Certifications from '../../../components/dashboard/pages/certifications/Certifications';
import GitHubProfile from '../../../components/dashboard/pages/github-profile/GitHubProfile';
import {
  analyzeResume,
  getCvProfile,
  getResume,
  saveCvProfile,
  uploadResume,
} from '../../../../../api/resumeApi';
import { ANALYSIS_STEPS, mapParsedToProfile } from '../../../../../utils/resumeAnalysisUtils';
import { applyProfileToState, buildProfilePayload } from '../../../../../utils/cvProfileUtils';
import './ResumePage.scss';

const TABS = [
  { id: 'skills', label: 'Skills', icon: FiCode },
  { id: 'experience', label: 'Experience', icon: FiBriefcase },
  { id: 'education', label: 'Education', icon: FiBookOpen },
  { id: 'projects', label: 'Projects', icon: FiFolder },
  { id: 'languages', label: 'Languages', icon: FiGlobe },
  { id: 'certifications', label: 'Certifications', icon: FiAward },
  { id: 'github', label: 'GitHub Profile', icon: FiGithub },
];

const ResumePage = () => {
  const [activeTab, setActiveTab] = useState('skills');
  const [file, setFile] = useState(null);
  const [resumeId, setResumeId] = useState(null);
  const [profileSaved, setProfileSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [analysisError, setAnalysisError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [ats, setAts] = useState(null);
  const [jobMatch, setJobMatch] = useState(null);

  const [skills, setSkills] = useState(['React', 'JavaScript', 'Node.js', 'Laravel', 'MySQL', 'Git']);
  const [experiences, setExperiences] = useState([{
    id: 1,
    company: 'Tech Co.',
    role: 'Frontend Developer',
    startDate: '2023-01',
    endDate: '',
    current: true,
    description: 'Built and maintained React applications.',
  }]);
  const [education, setEducation] = useState([{
    id: 1,
    school: 'University of Prishtina',
    degree: 'BSc Computer Science',
    fieldOfStudy: 'Computer Science',
    startDate: '2018-09',
    endDate: '2022-06',
    current: false,
  }]);
  const [languages, setLanguages] = useState([
    { id: 1, language: 'Albanian', level: 'Native' },
    { id: 2, language: 'English', level: 'Fluent' },
  ]);
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [github, setGithub] = useState({ profileUrl: '', repositories: [], portfolioLinks: [] });

  const applyAnalysisResult = useCallback((data) => {
    if (data?.ats) setAts(data.ats);
    if (data?.job_match) setJobMatch(data.job_match);

    const applyMapped = (mapped) => {
      if (mapped.skills.length) setSkills(mapped.skills);
      if (mapped.experiences.length) setExperiences(mapped.experiences);
      if (mapped.education.length) setEducation(mapped.education);
      if (mapped.languages.length) setLanguages(mapped.languages);
      if (mapped.projects.length) setProjects(mapped.projects);
      if (mapped.certifications.length) setCertifications(mapped.certifications);
      if (mapped.github.profileUrl || mapped.github.repositories.length || mapped.github.portfolioLinks.length) {
        setGithub(mapped.github);
      }
    };

    if (data?.profile) {
      applyProfileToState(data.profile, {
        setSkills,
        setExperiences,
        setEducation,
        setLanguages,
        setProjects,
        setCertifications,
        setGithub,
      });
      return;
    }

    const parsed = data?.structured || data?.parsed || data?.resume?.parsed_data;
    if (parsed) {
      applyMapped(mapParsedToProfile(parsed));
    }
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      const data = await getCvProfile();
      if (data?.profile) {
        applyProfileToState(data.profile, {
          setSkills,
          setExperiences,
          setEducation,
          setLanguages,
          setProjects,
          setCertifications,
          setGithub,
        });
        setProfileSaved(true);
      }
    } catch {
    }
  }, []);

  const loadExistingResume = useCallback(async () => {
    try {
      const data = await getResume();
      const resume = data?.resume;

      if (!resume) return;

      setResumeId(resume.id);
      setAts(resume.ats_rating);
      setJobMatch(resume.job_match);

      if (resume.parsed_data) {
        applyAnalysisResult({ parsed: resume.parsed_data, ats: resume.ats_rating, job_match: resume.job_match });
      }

      if (resume.original_filename) {
        setFile({ name: resume.original_filename, size: resume.file_size || 0 });
      }
    } catch {
    }
  }, [applyAnalysisResult]);

  useEffect(() => {
    loadProfile().then(loadExistingResume);
  }, [loadProfile, loadExistingResume]);

  const runAnalysis = async (selectedFile) => {
    setLoading(true);
    setAnalysisError('');

    try {
      setLoadingMessage(ANALYSIS_STEPS.uploading);
      const uploadResult = await uploadResume(selectedFile);
      const id = uploadResult.resume.id;
      setResumeId(id);

      const analysisResult = uploadResult.parsed || uploadResult.profile
        ? uploadResult
        : await analyzeResume(id);

      applyAnalysisResult(analysisResult);

      if (!analysisResult.profile) {
        await loadProfile();
      }
      setProfileSaved(true);
    } catch (err) {
      const data = err?.response?.data;
      const validationMessage = data?.errors
        ? Object.values(data.errors).flat().find(Boolean)
        : null;
      const message = !err?.response
        ? 'Server stopped responding (timed out or crashed). Run: php artisan serve — then try again.'
        : data?.error
        || validationMessage
        || data?.message
        || 'Failed to analyze resume. Please try again.';
      setAnalysisError(message);
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    setAnalysisError('');

    if (!selectedFile) {
      return;
    }

    await runAnalysis(selectedFile);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage('');
    try {
      const payload = buildProfilePayload({
        skills,
        experiences,
        education,
        languages,
        projects,
        certifications,
        github,
      });
      await saveCvProfile(payload);
      setProfileSaved(true);
      setSaveMessage('Profile saved. You can now preview or export PDFs.');
    } catch (err) {
      setSaveMessage(err?.response?.data?.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const renderActivePanel = () => {
    switch (activeTab) {
      case 'experience':
        return (
          <WorkExperience
            experiences={experiences}
            onExperiencesChange={setExperiences}
          />
        );
      case 'education':
        return (
          <Education
            education={education}
            onEducationChange={setEducation}
          />
        );
      case 'languages':
        return (
          <Languages
            languages={languages}
            onLanguagesChange={setLanguages}
          />
        );
      case 'projects':
        return (
          <Projects
            projects={projects}
            onProjectsChange={setProjects}
          />
        );
      case 'certifications':
        return (
          <Certifications
            certifications={certifications}
            onCertificationsChange={setCertifications}
          />
        );
      case 'github':
        return (
          <GitHubProfile
            github={github}
            onGithubChange={setGithub}
          />
        );
      case 'skills':
      default:
        return (
          <Skills
            skills={skills}
            onSkillsChange={setSkills}
          />
        );
    }
  };

  return (
    <UserDashboardLayout>
      <div className="resume-page">
        <header className="resume-page__hero">
          <h1 className="resume-page__title">Resume</h1>
          <p className="resume-page__subtitle">
            Upload your CV for AI analysis, refine your profile, then export with any template.
          </p>
        </header>

        <div className="resume-page__layout">
          <aside className="resume-page__sidebar" aria-label="Resume upload and insights">
            <ResumeUpload
              file={file}
              onFileSelect={handleFileSelect}
              loading={loading}
              loadingMessage={loadingMessage}
            />
            <ResumeAIInsights
              loading={loading}
              loadingMessage={loadingMessage}
              ats={ats}
              jobMatch={jobMatch}
              error={analysisError}
            />
            <ResumeTemplates disabled={!profileSaved} />
          </aside>

          <section className="resume-page__main" aria-label="Resume profile sections">
            <nav className="resume-page__tabs" role="tablist" aria-label="Resume sections">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === id}
                  className={`resume-page__tab${activeTab === id ? ' resume-page__tab--active' : ''}`}
                  onClick={() => setActiveTab(id)}
                >
                  <Icon size={15} aria-hidden="true" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>

            <div className="resume-page__panel" role="tabpanel">
              {renderActivePanel()}
            </div>
          </section>
        </div>

        <footer className="resume-page__footer">
          {saveMessage && <span className="resume-page__save-msg">{saveMessage}</span>}
          <button type="button" className="resume-page__cancel" onClick={() => setSaveMessage('')}>
            Cancel
          </button>
          <button
            type="button"
            className="resume-page__save"
            onClick={handleSave}
            disabled={saving}
          >
            <FiSave size={16} aria-hidden="true" />
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </footer>
      </div>
    </UserDashboardLayout>
  );
};

export default ResumePage;
