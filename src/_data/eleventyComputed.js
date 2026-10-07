// Per-page SEO data: social image and a schema.org graph (rendered once in base.njk).
import site from './site.js';

const absolute = path => new URL(site.basePath.replace(/\/$/, '') + path, site.url).href;
const home = absolute('/');
const orgId = `${home}#organization`;

function socialImage(data) {
  if (data.coverImage && data.coverFit !== 'contain') return { url: absolute(data.coverImage), alt: data.coverImageAlt || data.title };
  return { url: absolute('/assets/social-blue.png'), alt: 'LEACS seminar series — cognitive science and human–computer interaction', width: 1200, height: 630 };
}

function eventSchema(data, url) {
  const online = Boolean(data.meetingUrl) || /online/i.test(data.venue || '');
  const location = online
    // A meeting link with meetingOpens is withheld until that time, so it never goes into structured data.
    ? { '@type': 'VirtualLocation', url: (!data.meetingOpens && data.meetingUrl) || url }
    : { '@type': 'Place', name: data.venue || site.location, address: { '@type': 'PostalAddress', addressLocality: 'Jyväskylä', addressCountry: 'FI' } };
  return {
    '@type': 'Event', '@id': `${url}#event`, name: data.title, description: data.description, url,
    startDate: data.starts, ...(data.ends && { endDate: data.ends }),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: online ? 'https://schema.org/OnlineEventAttendanceMode' : 'https://schema.org/OfflineEventAttendanceMode',
    location, inLanguage: data.language && !/announced/i.test(data.language) ? data.language : site.language,
    image: [data.coverImage ? absolute(data.coverImage) : absolute('/assets/social-blue.png')],
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: 0, priceCurrency: 'EUR', availability: 'https://schema.org/InStock', url: data.registration || url },
    organizer: { '@id': orgId },
    performer: { '@type': 'Person', name: data.speaker, ...(data.affiliation && { affiliation: data.affiliation }), ...(data.speakerPhoto && { image: absolute(data.speakerPhoto) }), ...(data.speakerProfile && { sameAs: [data.speakerProfile] }) }
  };
}

export default {
  socialImage: data => socialImage(data),
  pageSchema(data) {
    if (!data.page || typeof data.page.url !== 'string' || !/(\/|\.html)$/.test(data.page.url)) return null;
    const url = absolute(data.page.url);
    const tags = data.tags || [];
    const isHome = data.page.url === '/';
    const graph = [
      { '@type': 'Organization', '@id': orgId, name: `${site.name} seminars`, alternateName: site.name, url: home, description: site.description,
        logo: absolute('/assets/apple-touch-icon.png'), email: site.email,
        parentOrganization: { '@type': 'CollegeOrUniversity', name: site.organization.name, url: site.organization.url } },
      { '@type': 'WebSite', '@id': `${home}#website`, name: `${site.name} seminars`, url: home, inLanguage: site.language, publisher: { '@id': orgId } },
      { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: isHome ? site.seoTitle : data.title, description: data.description || site.description,
        isPartOf: { '@id': `${home}#website` }, inLanguage: site.language, primaryImageOfPage: socialImage(data).url,
        ...(!isHome && { breadcrumb: { '@id': `${url}#breadcrumb` } }) }
    ];
    if (!isHome) {
      const trail = [['Home', home]];
      if (tags.includes('talk')) trail.push(['Talks', absolute('/talks/')]);
      if (tags.includes('post')) trail.push(['Journal', absolute('/journal/')]);
      trail.push([data.title, url]);
      graph.push({ '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: trail.map(([name, item], index) => ({ '@type': 'ListItem', position: index + 1, name, item })) });
    }
    if (tags.includes('talk') && !data.example && data.starts) graph.push(eventSchema(data, url));
    if (tags.includes('post') && !data.example) graph.push({ '@type': 'BlogPosting', '@id': `${url}#article`, headline: data.title, description: data.description, url,
      datePublished: new Date(data.page.date).toISOString(), author: { '@type': data.author === site.name ? 'Organization' : 'Person', name: data.author || site.name },
      publisher: { '@id': orgId }, image: socialImage(data).url, mainEntityOfPage: { '@id': `${url}#webpage` } });
    return { '@context': 'https://schema.org', '@graph': graph };
  }
};
