const PUBLIC_PAGES = [
  { id: 'home', match: (path) => path === '/' },
  { id: 'about', match: (path) => path === '/about-us' },
  { id: 'jobs', match: (path) => path === '/jobs' || path.startsWith('/jobs/') },
  { id: 'companies', match: (path) => path === '/companies' || path.startsWith('/companies/') },
  { id: 'pricing', match: (path) => path === '/pricing' },
  { id: 'contact', match: (path) => path === '/contact-us' },
];

export function getPublicPageIdForPath(pathname) {
  const page = PUBLIC_PAGES.find((entry) => entry.match(pathname));
  return page?.id ?? null;
}

export function isPublicPageEnabled(pathname, userViewPages = []) {
  const pageId = getPublicPageIdForPath(pathname);
  if (!pageId) return true;
  const config = userViewPages.find((p) => p.id === pageId);
  if (!config) return true;
  return config.enabled !== false;
}
