import {
  normalizeCertification,
  normalizeEducation,
  normalizeExperience,
  normalizeLanguage,
  normalizeProject,
  toInputValue,
} from './formFieldUtils';

export const mapParsedToProfile = (parsed = {}) => {
  const personal = parsed.personal_info || {};
  const source = parsed.personal_info
    ? {
        name: personal.full_name || '',
        email: personal.email || '',
        phone: personal.phone || '',
        skills: parsed.skills || [],
        experience: (parsed.experience || []).map((item) => ({
          company: item.company || '',
          role: item.title || item.role || '',
          start_date: item.start_date || '',
          end_date: item.end_date || '',
          description: item.description || '',
        })),
        education: (parsed.education || []).map((item) => ({
          institution: item.institution || '',
          degree: item.degree || '',
          field_of_study: item.field_of_study || '',
          start_date: item.start_date || '',
          end_date: item.year || item.end_date || '',
        })),
        languages: parsed.languages || [],
        projects: parsed.projects || [],
        certifications: parsed.certifications || [],
        github: parsed.github || '',
        github_repositories: parsed.github_repositories || [],
        portfolio_links: parsed.portfolio_links || [],
      }
    : parsed;

  const skills = Array.isArray(source.skills)
    ? source.skills.map((s) => toInputValue(s)).filter(Boolean)
    : [];

  const experiences = (source.experience || []).map((item, index) => normalizeExperience(item, index));
  const education = (source.education || []).map((item, index) => normalizeEducation(item, index));
  const languages = (source.languages || []).map((item, index) => normalizeLanguage(item, index));
  const projects = (source.projects || []).map((item, index) => normalizeProject(item, index));
  const certifications = (source.certifications || []).map((item, index) => normalizeCertification(item, index));

  const github = {
    profileUrl: toInputValue(source.github),
    repositories: Array.isArray(source.github_repositories) ? source.github_repositories : [],
    portfolioLinks: Array.isArray(source.portfolio_links) ? source.portfolio_links : [],
  };

  return {
    skills,
    experiences,
    education,
    languages,
    projects,
    certifications,
    github,
    personal: {
      fullName: toInputValue(source.name),
      email: toInputValue(source.email),
      phone: toInputValue(source.phone),
    },
  };
};

export const ANALYSIS_STEPS = {
  idle: '',
  uploading: 'Uploading and scanning your CV…',
  extracting: 'Extracting text from PDF…',
  parsing: 'Parsing your CV with AI…',
  rating: 'Calculating ATS score…',
  matching: 'Matching your profile to jobs…',
};
