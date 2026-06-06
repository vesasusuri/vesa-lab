
export const toInputValue = (value) => (value == null ? '' : String(value));


export const normalizeMonthValue = (value) => {
  const raw = toInputValue(value).trim();

  if (!raw) {
    return '';
  }

  if (/^\d{4}-\d{2}$/.test(raw)) {
    return raw;
  }

  if (/present|current/i.test(raw)) {
    return '';
  }

  const yearMonth = raw.match(/(\d{4})[.\/-](\d{1,2})/);
  if (yearMonth) {
    return `${yearMonth[1]}-${yearMonth[2].padStart(2, '0')}`;
  }

  const monthYear = raw.match(/([a-z]{3,9})\s+(\d{4})/i);
  if (monthYear) {
    const months = {
      jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
      jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
    };
    const key = monthYear[1].slice(0, 3).toLowerCase();

    if (months[key]) {
      return `${monthYear[2]}-${months[key]}`;
    }
  }

  const yearOnly = raw.match(/\b(19|20)\d{2}\b/);
  if (yearOnly) {
    return `${yearOnly[0]}-01`;
  }

  return '';
};

export const normalizeExperience = (exp = {}, index = 0) => ({
  id: exp.id ?? Date.now() + index,
  company: toInputValue(exp.company),
  role: toInputValue(exp.role),
  startDate: normalizeMonthValue(exp.startDate ?? exp.start_date),
  endDate: normalizeMonthValue(exp.endDate ?? exp.end_date),
  current: Boolean(exp.current) || /present|current/i.test(toInputValue(exp.endDate ?? exp.end_date)),
  description: toInputValue(exp.description),
});

export const normalizeEducation = (edu = {}, index = 0) => ({
  id: edu.id ?? Date.now() + index + 1000,
  school: toInputValue(edu.school ?? edu.institution),
  degree: toInputValue(edu.degree),
  fieldOfStudy: toInputValue(edu.fieldOfStudy ?? edu.field_of_study),
  startDate: normalizeMonthValue(edu.startDate ?? edu.start_date),
  endDate: normalizeMonthValue(edu.endDate ?? edu.end_date),
  current: Boolean(edu.current),
});

export const normalizeLanguage = (lang = {}, index = 0) => ({
  id: lang.id ?? Date.now() + index + 2000,
  language: toInputValue(lang.language),
  level: toInputValue(lang.level) || 'Fluent',
});

export const normalizeProject = (project = {}, index = 0) => ({
  id: project.id ?? Date.now() + index + 3000,
  name: toInputValue(project.name),
  description: toInputValue(project.description),
  technologies: Array.isArray(project.technologies) ? project.technologies : [],
  url: toInputValue(project.url),
  startDate: normalizeMonthValue(project.startDate ?? project.start_date),
  endDate: normalizeMonthValue(project.endDate ?? project.end_date),
});

export const normalizeCertification = (cert = {}, index = 0) => ({
  id: cert.id ?? Date.now() + index + 4000,
  name: toInputValue(cert.name),
  issuer: toInputValue(cert.issuer),
  year: toInputValue(cert.year),
});
