import site from './src/_data/site.js';

// Month-only listings use a month boundary for sorting, never as an event date.
function scheduleTime(item) {
  return new Date(item.data.starts || `${item.data.plannedMonth}-01T00:00:00Z`).getTime();
}
function isUpcoming(item) {
  if (item.data.starts) return new Date(item.data.ends || item.data.starts) >= new Date();
  const currentMonth = new Intl.DateTimeFormat('sv-SE', { year: 'numeric', month: '2-digit', timeZone: site.timezone }).format(new Date());
  return Boolean(item.data.plannedMonth && item.data.plannedMonth >= currentMonth);
}

export default function (config) {
  // Windows network shares may not support native file watching.
  if (process.platform === 'win32') config.setChokidarConfig({ usePolling: true, interval: 1000 });
  config.addPassthroughCopy({ 'src/assets': 'assets', 'content/images': 'content/images', 'content/pdfs': 'content/pdfs' });
  config.addWatchTarget('content');
  config.addFilter('json', value => JSON.stringify(value).replace(/</g, '\\u003c'));
  config.addFilter('absolute', value => new URL(value, site.url).href);
  config.addFilter('dateLabel', (value, style = 'long') => new Intl.DateTimeFormat('en-GB', { dateStyle: style, timeZone: site.timezone }).format(new Date(value)));
  config.addFilter('timeLabel', value => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: site.timezone, timeZoneName: 'short' }).format(new Date(value)));
  config.addFilter('iso', value => new Date(value).toISOString());
  config.addFilter('month', value => new Intl.DateTimeFormat('en-GB', { month: 'short', timeZone: site.timezone }).format(new Date(value)));
  config.addFilter('day', value => new Intl.DateTimeFormat('en-GB', { day: '2-digit', timeZone: site.timezone }).format(new Date(value)));
  config.addFilter('take', (items, count) => items.slice(0, count));
  config.addFilter('monthLabel', value => new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}-01T12:00:00Z`)));
  config.addCollection('talks', api => api.getFilteredByTag('talk').filter(item => !item.data.draft).sort((a,b) => Number(Boolean(a.data.example)) - Number(Boolean(b.data.example)) || scheduleTime(b) - scheduleTime(a)));
  config.addCollection('upcoming', api => api.getFilteredByTag('talk').filter(item => !item.data.draft && isUpcoming(item)).sort((a,b) => scheduleTime(a) - scheduleTime(b)));
  config.addCollection('posts', api => api.getFilteredByTag('post').filter(item => !item.data.draft).sort((a,b) => b.date - a.date));
  config.addGlobalData('buildYear', new Date().getUTCFullYear());
  return { dir: { input: 'src', output: '_site' }, markdownTemplateEngine: 'njk', htmlTemplateEngine: 'njk', pathPrefix: site.basePath };
}
