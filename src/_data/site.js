// Edit these settings first. URL is the origin only; basePath is the repository path.
const fonts = {
  Ubuntu: { family: 'Ubuntu', query: 'Ubuntu:wght@300;400;500;700' },
  Inter: { family: 'Inter', query: 'Inter:wght@400;500;600;700' },
  'DM Sans': { family: 'DM Sans', query: 'DM+Sans:wght@400;500;600;700' },
  'Source Sans 3': { family: 'Source Sans 3', query: 'Source+Sans+3:wght@400;500;600;700' }
};
const selectedFont = 'Inter';
// Headings and small technical labels. Set either to null to use the body font instead.
const displayFont = { family: 'Space Grotesk', query: 'Space+Grotesk:wght@500;600;700' };
const monoFont = { family: 'JetBrains Mono', query: 'JetBrains+Mono:wght@400;500' };
const basePath = process.env.SITE_BASE_PATH || '/';
export default {
  name: 'LEACS',
  // Homepage <title> and social title. Keep it under about 60 characters.
  seoTitle: 'LEACS Seminars · Cognitive Science & HCI at JYU',
  affiliation: 'Cognitive Science, Faculty of Information Technology, University of Jyväskylä',
  organization: { name: 'University of Jyväskylä', url: 'https://www.jyu.fi/en', department: 'Cognitive Science', departmentUrl: 'https://www.jyu.fi/en/research-groups/cognitive-science' },
  description: 'An open seminar series exploring minds, technology, and the ways we interact. Cognitive science, human–computer interaction, and ideas in between.',
  url: process.env.SITE_URL || 'https://jyu-leacs.github.io',
  basePath: `/${basePath.split('/').filter(Boolean).join('/')}${basePath === '/' ? '' : '/'}`,
  timezone: 'Europe/Helsinki',
  language: 'en',
  locale: 'en_GB',
  email: 'aaron.a.khodami@jyu.fi', // Seminar manager’s published JYU address.
  contactFormUrl: 'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=WC1m6aTKwUuxOMixrKtaEb7Lmo5J0SJFhpTpDOlt9AlUM1dKTE1YOFNSRVNMSVlFSzAxUUZVMVI5WC4u',
  location: 'Venue announced with each seminar',
  demo: true, // Set false after replacing the sample talks and journal posts.
  font: fonts[selectedFont],
  displayFont: displayFont || fonts[selectedFont],
  monoFont: monoFont || fonts[selectedFont],
  fontOptions: Object.keys(fonts),
  social: { github: '', linkedin: '' }
};
