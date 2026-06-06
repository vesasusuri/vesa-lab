export const JOB_LISTING_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Remote',
];

export function normalizeJobTypes(types, fallbackType = '') {
  const source = Array.isArray(types)
    ? types
    : (fallbackType ? [fallbackType] : []);

  const allowed = new Set(JOB_LISTING_TYPES);
  const normalized = [];

  source.forEach((value) => {
    const trimmed = String(value ?? '').trim();
    if (trimmed && allowed.has(trimmed) && !normalized.includes(trimmed)) {
      normalized.push(trimmed);
    }
  });

  return normalized;
}

export function typesIncludingRemoteFromLocation(types, fallbackType = '', location = '') {
  const normalized = normalizeJobTypes(types, fallbackType);

  if (!normalized.includes('Remote') && /remote/i.test(location || '')) {
    return [...normalized, 'Remote'];
  }

  return normalized;
}

export function jobTypesLabel(types, fallbackType = 'Full-time') {
  const normalized = normalizeJobTypes(types, fallbackType);

  return normalized.length > 0 ? normalized.join(', ') : fallbackType;
}

export function validateJobForm(form) {
  const errors = {};
  const title = (form.title ?? '').trim();
  const company = (form.company ?? '').trim();
  const location = (form.location ?? '').trim();
  const salary = (form.salary ?? '').trim();
  const types = normalizeJobTypes(form.types, form.type);

  if (!title) {
    errors.title = 'Job title is required.';
  } else if (title.length < 2) {
    errors.title = 'Job title must be at least 2 characters.';
  }

  if (!company) {
    errors.company = 'Company name is required.';
  } else if (company.length < 2) {
    errors.company = 'Company name must be at least 2 characters.';
  }

  if (!location) {
    errors.location = 'Location is required.';
  } else if (location.length < 2) {
    errors.location = 'Location must be at least 2 characters.';
  }

  if (!salary) {
    errors.salary = 'Salary range is required.';
  } else if (salary.length < 2) {
    errors.salary = 'Enter a valid salary range.';
  }

  if (types.length === 0) {
    errors.types = 'Select at least one job type.';
  }

  const description = (form.description ?? '').trim();
  if (!description) {
    errors.description = 'Job description is required.';
  } else if (description.length < 20) {
    errors.description = 'Description must be at least 20 characters.';
  }

  return errors;
}

export function mapApiErrorsToJobForm(apiErrors) {
  if (!apiErrors || typeof apiErrors !== 'object') {
    return {};
  }

  const mapped = {};
  Object.entries(apiErrors).forEach(([key, messages]) => {
    const field = key.startsWith('types.') ? 'types' : key;
    const message = Array.isArray(messages) ? messages[0] : messages;
    if (message && !mapped[field]) {
      mapped[field] = message;
    }
  });

  return mapped;
}

export function hasJobFormErrors(errors) {
  return Object.keys(errors).length > 0;
}
