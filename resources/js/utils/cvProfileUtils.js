import {
  normalizeCertification,
  normalizeEducation,
  normalizeExperience,
  normalizeLanguage,
  normalizeProject,
} from './formFieldUtils';

export const buildProfilePayload = ({ personal, skills, experiences, education, languages, projects = [], certifications = [], github }) => ({
  personal: {
    ...(personal || {}),
    github: github?.profileUrl || personal?.github || '',
    github_repositories: github?.repositories || personal?.github_repositories || [],
    portfolio_links: github?.portfolioLinks || personal?.portfolio_links || [],
  },
  skills: skills || [],
  experiences: experiences || [],
  education: education || [],
  languages: languages || [],
  projects,
  certifications,
});

export const applyProfileToState = (profile, setters) => {
  if (!profile) return;

  const {
    setPersonal,
    setSkills,
    setExperiences,
    setEducation,
    setLanguages,
    setProjects,
    setCertifications,
    setGithub,
  } = setters;

  if (profile.personal && setPersonal) {
    setPersonal(profile.personal);
  }

  if (profile.skills?.length && setSkills) {
    setSkills(profile.skills);
  }

  if (profile.experiences?.length && setExperiences) {
    setExperiences(profile.experiences.map((e, i) => normalizeExperience(e, i)));
  }

  if (profile.education?.length && setEducation) {
    setEducation(profile.education.map((e, i) => normalizeEducation(e, i)));
  }

  if (profile.languages?.length && setLanguages) {
    setLanguages(profile.languages.map((l, i) => normalizeLanguage(l, i)));
  }

  if (profile.projects?.length && setProjects) {
    setProjects(profile.projects.map((p, i) => normalizeProject(p, i)));
  }

  if (profile.certifications?.length && setCertifications) {
    setCertifications(profile.certifications.map((c, i) => normalizeCertification(c, i)));
  }

  if (setGithub) {
    setGithub((current = {}) => ({
      profileUrl: profile.personal?.github || current.profileUrl || '',
      repositories: profile.personal?.github_repositories || current.repositories || [],
      portfolioLinks: profile.personal?.portfolio_links || current.portfolioLinks || [],
    }));
  }
};
