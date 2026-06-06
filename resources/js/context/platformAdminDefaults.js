export const STORAGE_KEY = 'bee_hired_admin_store_v1';

export const initialPageContent = {
  home: {
    proofText: '1k+ student reviews',
    heroTitle: 'Build skills. New opportunities.',
    heroSubtitle: 'Bee Hired helps you discover new job opportunities and move confidently toward your next step.',
    primaryCta: 'Explore the job market',
    secondaryCta: 'Browse Jobs',
    categoriesTitle: 'Popular category',
    categoriesCta: 'View All',
    companiesEyebrow: 'Top employers',
    companiesTitle: 'Discover companies hiring right now',
    companiesDescription: 'Explore standout companies, compare team size and location, and find the places where your next role could start.',
    companiesCta: 'Browse companies',
    findJobTitle: 'Find Your Next Opportunity',
    findJobHighlight: 'Opportunity',
    findJobDescription: 'Browse 20+ open positions across top companies. Your dream job is one search away.',
    findJobCta: 'Explore the job market',
  },
  about: {
    heroEyebrow: 'About Bee Hired',
    heroTitle: 'Helping students and companies meet faster',
    heroDescription: 'Bee Hired connects emerging talent with hiring teams through a cleaner, more focused hiring experience.',
    missionTitle: 'Our mission',
    missionDescription: 'Make hiring more transparent, practical, and accessible for students, graduates, and HR teams.',
    statsTitle: 'Our impact',
    primaryCta: 'Explore companies',
  },
  companies: {
    heroEyebrow: 'Companies',
    heroTitle: 'Discover companies hiring right now',
    heroDescription: 'Compare employers, learn about their teams, and find the place where your next role could start.',
    featuredTitle: 'Featured companies',
    featuredDescription: 'A curated list of employers actively looking for new talent.',
    primaryCta: 'Browse companies',
  },
  jobs: {
    heroTitle: 'Find the right job for your next step',
    heroDescription: 'Search roles across design, engineering, marketing, business, and more.',
    filterTitle: 'Search jobs',
    listingsTitle: 'Latest opportunities',
    primaryCta: 'View jobs',
  },
  pricing: {
    heroEyebrow: 'Pricing',
    heroTitle: 'Choose the plan that fits your hiring needs',
    heroDescription: 'Start small, grow your hiring workflow, and invite your team when you are ready.',
    plansTitle: 'Plans for every team',
    faqTitle: 'Pricing questions',
    primaryCta: 'Get started',
  },
  contact: {
    heroEyebrow: 'Contact',
    heroTitle: 'Talk to the Bee Hired team',
    heroDescription: 'Send us a message and we will help with accounts, HR profiles, or platform questions.',
    formTitle: 'Send a message',
    formDescription: 'Tell us what you need and the team will respond as soon as possible.',
    primaryCta: 'Send message',
  },
};

export const initialData = {
  homeContent: initialPageContent.home,
  homeSections: [
    {
      key: 'banner',
      title: 'Banner Section',
      isActive: true,
      sortOrder: 1,
      items: [
        { title: 'Avatar 1', imageUrl: 'https://i.pravatar.cc/80?img=47', imageAlt: 'Banner avatar 1', sortOrder: 1, isActive: true },
        { title: 'Avatar 2', imageUrl: 'https://i.pravatar.cc/80?img=32', imageAlt: 'Banner avatar 2', sortOrder: 2, isActive: true },
        { title: 'Avatar 3', imageUrl: 'https://i.pravatar.cc/80?img=68', imageAlt: 'Banner avatar 3', sortOrder: 3, isActive: true },
      ],
    },
    {
      key: 'trusted_by',
      title: 'Trusted By',
      isActive: true,
      sortOrder: 2,
      items: [
        { title: 'Borek', imageUrl: 'https://dummyimage.com/100x100/f3f4f6/111827&text=Borek', imageAlt: 'Borek', metadata: { width: 100, height: 100 }, sortOrder: 1, isActive: true },
        { title: 'Munda', imageUrl: 'https://dummyimage.com/160x120/f3f4f6/111827&text=Munda', imageAlt: 'Munda', metadata: { width: 160, height: 120 }, sortOrder: 2, isActive: true },
        { title: 'NFON', imageUrl: 'https://dummyimage.com/140x100/f3f4f6/111827&text=NFON', imageAlt: 'NFON', metadata: { width: 140, height: 100 }, sortOrder: 3, isActive: true },
      ],
    },
    {
      key: 'companies_cards',
      title: 'Featured companies',
      isActive: true,
      sortOrder: 4,
      items: [],
    },
  ],
  pageContent: initialPageContent,
  userViewPages: [
    { id: 'home', title: 'Home', path: '/', enabled: true, showInNav: true, navOrder: 1 },
    { id: 'about', title: 'About Us', path: '/about-us', enabled: true, showInNav: true, navOrder: 2 },
    { id: 'jobs', title: 'Jobs', path: '/jobs', enabled: true, showInNav: true, navOrder: 3 },
    { id: 'companies', title: 'Companies', path: '/companies', enabled: true, showInNav: true, navOrder: 4 },
    { id: 'pricing', title: 'Pricing', path: '/pricing', enabled: true, showInNav: true, navOrder: 5 },
    { id: 'contact', title: 'Contact Us', path: '/contact-us', enabled: true, showInNav: true, navOrder: 6 },
  ],
  userDashboardCards: [
    { id: 'applied', label: 'Applied Jobs', value: 1, icon: 'FiBriefcase' },
    { id: 'unfinished', label: 'Unfinished Jobs', value: 0, icon: 'FiFileText' },
    { id: 'messages', label: 'New Message', value: 0, icon: 'FiMessageSquare' },
    { id: 'notifications', label: 'Notification', value: 1, icon: 'FiBell' },
  ],
  hireDashboardCards: [
    { id: 'postings', label: 'Total Postings', value: 16, sub: '+2 this week', icon: 'FiClipboard' },
    { id: 'applications', label: 'Applications', value: 48, sub: '+11 this week', icon: 'FiInbox' },
    { id: 'interviews', label: 'Interviews Set', value: 12, sub: '4 this week', icon: 'FiCalendar' },
    { id: 'hires', label: 'Hires This Month', value: 3, sub: 'On track', icon: 'FiCheckCircle' },
  ],
  users: [
    { id: 'user-1', name: 'Vesa Admin', email: 'admin@beehired.com', role: 'Admin', status: 'Active' },
    { id: 'user-2', name: 'Mia Recruiter', email: 'mia@northline.io', role: 'HR', status: 'Active' },
  ],
  hrInvites: [
    { id: 'invite-1', company: 'Northline Studio', email: 'hr@northline.io', status: 'Sent' },
  ],
  activityLogs: [
    { id: 'log-1', actor: 'Vesa Admin', role: 'Admin', action: 'Viewed page', page: 'Admin Overview', path: '/admin-dashboard', device: 'Desktop', time: 'Today, 09:41' },
    { id: 'log-2', actor: 'Mia Recruiter', role: 'HR', action: 'Viewed page', page: 'Applications', path: '/hire-dashboard/applications', device: 'Desktop', time: 'Today, 09:28' },
    { id: 'log-3', actor: 'Guest User', role: 'Guest', action: 'Viewed page', page: 'Jobs', path: '/jobs', device: 'Mobile', time: 'Today, 09:12' },
    { id: 'log-4', actor: 'Ardit Krasniqi', role: 'Candidate', action: 'Viewed page', page: 'Profile', path: '/profile', device: 'Desktop', time: 'Yesterday, 18:05' },
  ],
  settings: {
    accentColor: '#fdd535',
    iconColor: '#ffffff',
    inviteExpiryDays: 7,
    maxInviteUses: 1,
    announcementEnabled: false,
    announcementText: 'New student hiring programs are open this week.',
    maintenanceMode: false,
    allowUserSignup: true,
    allowHrSignup: false,
    requireAdminApprovalForHr: true,
    supportEmail: 'support@beehired.com',
    defaultInviteRole: 'HR Manager',
    inviteEmailSubject: 'Bee Hired HR Profile Invitation',
    inviteEmailMessage: 'You are invited to create your HR profile on Bee Hired. Please complete your profile setup from the HR dashboard invitation link.',
  },
};

export const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const mergePageContent = (storedPageContent = {}, storedHomeContent = {}) => {
  const merged = Object.entries(initialPageContent).reduce((pages, [key, defaults]) => ({
    ...pages,
    [key]: {
      ...defaults,
      ...(key === 'home' ? storedHomeContent : {}),
      ...(storedPageContent[key] || {}),
    },
  }), {});

  return merged;
};

export const mergeUserViewPages = (storedPages = []) => initialData.userViewPages.map((page) => {
  const storedPage = storedPages.find((item) => item.id === page.id || item.path === page.path);
  return {
    ...page,
    ...(storedPage || {}),
    id: page.id,
    path: page.path,
  };
});

export const mergeHomeSections = (storedSections = []) => {
  if (!Array.isArray(storedSections) || storedSections.length === 0) {
    return initialData.homeSections;
  }

  return storedSections.map((section) => ({
    ...section,
    items: Array.isArray(section.items) ? section.items : [],
  }));
};

export const loadInitialPlatformState = () => initialData;
