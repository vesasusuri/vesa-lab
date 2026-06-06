export const PROFILE_JOB_TYPES = ['Remote', 'On-site', 'Hybrid'];

export const PROFILE_AVAILABILITY_OPTIONS = [
  'Immediately',
  '1 week notice',
  '2 weeks notice',
  '1 month notice',
];

export const PROFILE_ABOUT_MAX = 500;

export const emptyProfileForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  location: '',
  dateOfBirth: '',
  nationality: '',
  jobTitle: '',
  linkedin: '',
  github: '',
  portfolio: '',
  desiredRole: '',
  jobType: 'Remote',
  expectedSalary: '',
  availability: 'Immediately',
  about: '',
  avatarUrl: null,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s().-]{7,64}$/;
const NAME_RE = /^[a-zA-ZÀ-ÿĀ-ž\s'-]+$/;
const LINKEDIN_RE = /^(https?:\/\/)?(?:[\w-]+\.)*linkedin\.com\/[\w\-./%]+$/i;
const GITHUB_RE = /^(https?:\/\/)?(?:[\w-]+\.)*github\.com\/[\w\-./%]+$/i;
const PORTFOLIO_RE = /^(https?:\/\/)?[\w.-]+(\.[\w.-]+)+([\w\-./?%+]*)?$/i;

export function profileToForm(profile) {
  if (!profile) {
    return { ...emptyProfileForm };
  }

  return {
    firstName: profile.firstName ?? '',
    lastName: profile.lastName ?? '',
    email: profile.email ?? '',
    phone: profile.phone ?? '',
    location: profile.location ?? '',
    dateOfBirth: profile.dateOfBirth ?? '',
    nationality: profile.nationality ?? '',
    jobTitle: profile.jobTitle ?? '',
    linkedin: profile.linkedin ?? '',
    github: profile.github ?? '',
    portfolio: profile.portfolio ?? '',
    desiredRole: profile.desiredRole ?? '',
    jobType: profile.jobType ?? 'Remote',
    expectedSalary: profile.expectedSalary ?? '',
    availability: profile.availability ?? 'Immediately',
    about: profile.about ?? '',
    avatarUrl: profile.avatarUrl ?? null,
  };
}

export function formToProfilePayload(form) {
  return {
    firstName: form.firstName?.trim() ?? '',
    lastName: form.lastName?.trim() ?? '',
    email: form.email?.trim() ?? '',
    phone: form.phone?.trim() ?? '',
    location: form.location?.trim() ?? '',
    dateOfBirth: form.dateOfBirth || null,
    nationality: form.nationality?.trim() ?? '',
    jobTitle: form.jobTitle?.trim() ?? '',
    linkedin: form.linkedin?.trim() ?? '',
    github: form.github?.trim() ?? '',
    portfolio: form.portfolio?.trim() ?? '',
    desiredRole: form.desiredRole?.trim() ?? '',
    jobType: form.jobType ?? '',
    expectedSalary: form.expectedSalary === '' ? null : Number(form.expectedSalary),
    availability: form.availability ?? '',
    about: form.about?.trim() ?? '',
  };
}

export function validateProfileForm(form) {
  const errors = {};
  const firstName = (form.firstName ?? '').trim();
  const lastName = (form.lastName ?? '').trim();
  const email = (form.email ?? '').trim();
  const phone = (form.phone ?? '').trim();
  const location = (form.location ?? '').trim();
  const nationality = (form.nationality ?? '').trim();
  const jobTitle = (form.jobTitle ?? '').trim();
  const linkedin = (form.linkedin ?? '').trim();
  const github = (form.github ?? '').trim();
  const portfolio = (form.portfolio ?? '').trim();
  const desiredRole = (form.desiredRole ?? '').trim();
  const about = (form.about ?? '').trim();
  const dateOfBirth = form.dateOfBirth ?? '';
  const expectedSalary = form.expectedSalary ?? '';

  if (!firstName) {
    errors.firstName = 'First name is required.';
  } else if (firstName.length < 2) {
    errors.firstName = 'First name must be at least 2 characters.';
  } else if (!NAME_RE.test(firstName)) {
    errors.firstName = 'First name may only contain letters, spaces, hyphens, and apostrophes.';
  }

  if (!lastName) {
    errors.lastName = 'Last name is required.';
  } else if (lastName.length < 2) {
    errors.lastName = 'Last name must be at least 2 characters.';
  } else if (!NAME_RE.test(lastName)) {
    errors.lastName = 'Last name may only contain letters, spaces, hyphens, and apostrophes.';
  }

  if (!email) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_RE.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!phone) {
    errors.phone = 'Phone number is required.';
  } else if (!PHONE_RE.test(phone)) {
    errors.phone = 'Enter a valid phone number.';
  }

  if (!location) {
    errors.location = 'Location is required.';
  } else if (location.length < 2) {
    errors.location = 'Location must be at least 2 characters.';
  }

  if (dateOfBirth) {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(dob.getTime())) {
      errors.dateOfBirth = 'Enter a valid date of birth.';
    } else if (dob >= today) {
      errors.dateOfBirth = 'Date of birth must be in the past.';
    } else if (dob < new Date('1900-01-01')) {
      errors.dateOfBirth = 'Enter a valid date of birth.';
    }
  }

  if (nationality && !NAME_RE.test(nationality)) {
    errors.nationality = 'Nationality may only contain letters, spaces, hyphens, and apostrophes.';
  }

  if (!jobTitle) {
    errors.jobTitle = 'Professional title is required.';
  } else if (jobTitle.length < 2) {
    errors.jobTitle = 'Professional title must be at least 2 characters.';
  }

  if (linkedin && !LINKEDIN_RE.test(linkedin)) {
    errors.linkedin = 'Enter a valid LinkedIn URL (e.g. linkedin.com/in/yourname).';
  }

  if (github && !GITHUB_RE.test(github)) {
    errors.github = 'Enter a valid GitHub URL (e.g. github.com/yourname).';
  }

  if (portfolio && !PORTFOLIO_RE.test(portfolio)) {
    errors.portfolio = 'Enter a valid portfolio URL (e.g. yoursite.com).';
  }

  if (!desiredRole) {
    errors.desiredRole = 'Desired role is required.';
  } else if (desiredRole.length < 2) {
    errors.desiredRole = 'Desired role must be at least 2 characters.';
  }

  if (!form.jobType) {
    errors.jobType = 'Select a job type.';
  } else if (!PROFILE_JOB_TYPES.includes(form.jobType)) {
    errors.jobType = 'Select a valid job type.';
  }

  if (expectedSalary !== '' && expectedSalary !== null && expectedSalary !== undefined) {
    const salary = Number(expectedSalary);
    if (!Number.isInteger(salary) || salary < 0 || salary > 99999999) {
      errors.expectedSalary = 'Expected salary must be a whole number up to 99,999,999.';
    }
  }

  if (!form.availability) {
    errors.availability = 'Select your availability.';
  } else if (!PROFILE_AVAILABILITY_OPTIONS.includes(form.availability)) {
    errors.availability = 'Select a valid availability option.';
  }

  if (!about) {
    errors.about = 'About me is required.';
  } else if (about.length < 20) {
    errors.about = 'About me must be at least 20 characters.';
  } else if (about.length > PROFILE_ABOUT_MAX) {
    errors.about = `About me cannot exceed ${PROFILE_ABOUT_MAX} characters.`;
  }

  return errors;
}

export function mapApiErrorsToForm(apiErrors) {
  if (!apiErrors || typeof apiErrors !== 'object') {
    return {};
  }

  const mapped = {};
  Object.entries(apiErrors).forEach(([key, messages]) => {
    const message = Array.isArray(messages) ? messages[0] : messages;
    if (message) {
      mapped[key] = message;
    }
  });

  return mapped;
}

export function hasProfileErrors(errors) {
  return Object.keys(errors).length > 0;
}
