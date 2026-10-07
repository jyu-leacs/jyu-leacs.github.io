import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import Calendar from '../src/calendar.11ty.js';
import nunjucks from 'nunjucks';

async function files(directory) {
  const result = [];
  for (const name of await readdir(directory)) {
    const full = path.join(directory, name);
    if ((await stat(full)).isDirectory()) result.push(...await files(full));
    else result.push(full);
  }
  return result;
}
test('all generated local links and assets resolve, including project paths', async () => {
  const prefix = (process.env.SITE_BASE_PATH || '').replace(/\/$/, '');
  const output = await files('_site');
  for (const file of output.filter(file => file.endsWith('.html'))) {
    const html = await readFile(file, 'utf8');
    for (const [, raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|mailto:|#|data:)/.test(raw)) continue;
      let url = raw.split(/[?#]/)[0];
      if (!url) continue;
      if (prefix) { assert.ok(url.startsWith(prefix + '/'), `${file}: missing prefix in ${url}`); url = url.slice(prefix.length); }
      const target = path.join('_site', decodeURIComponent(url), url.endsWith('/') ? 'index.html' : '');
      assert.ok(output.includes(target), `${file}: broken local reference ${raw}`);
    }
    assert.match(html, /<h1[ >]/, `${file}: missing primary heading`);
    assert.match(html, /name="description"/, `${file}: missing description`);
    assert.match(html, /rel="canonical"/, `${file}: missing canonical URL`);
    const json = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
    assert.doesNotThrow(() => JSON.parse(json[1]));
  }
});
test('example events are labelled and excluded from sitemap', async () => {
  const sitemap = await readFile('_site/sitemap.xml', 'utf8');
  for (const file of (await files('_site')).filter(file => file.endsWith('.html'))) {
    const html = await readFile(file, 'utf8');
    if (html.includes('noindex,follow')) {
      const canonical = html.match(/rel="canonical" href="([^"]+)"/)[1];
      assert.ok(!sitemap.includes(`<loc>${canonical}</loc>`), `${file}: noindex page in sitemap`);
    }
    if (html.includes('Not a confirmed event')) {
      assert.match(html, /noindex,follow/);
      assert.doesNotMatch(html, /Add to calendar/);
    }
  }
});

test('calendar downloads preserve absolute instants and valid UTF-8 line lengths', () => {
  const calendar = new Calendar();
  const talk = { page: { fileSlug: 'a-real-talk' }, url: '/talks/a-real-talk/', date: new Date('2026-10-02T00:00:00Z'), data: {
    title: 'Älykäs interaction, people; systems '.repeat(6), description: 'First line\nSecond line', venue: 'Jyväskylä',
    starts: '2026-10-22T14:00:00+03:00', ends: '2026-10-22T15:00:00+03:00'
  } };
  const ics = calendar.render({ talk });
  assert.match(ics, /DTSTART:20261022T110000Z/);
  assert.match(ics, /DTEND:20261022T120000Z/);
  assert.match(ics, /DESCRIPTION:First line\\nSecond line/);
  for (const line of ics.split('\r\n')) assert.ok(Buffer.byteLength(line) <= 75);
  const unfolded = ics.replace(/\r\n /g, '');
  assert.match(unfolded, /Älykäs interaction\\, people\\; systems/);
  assert.deepEqual(calendar.data().pagination.before([{ data: { example: true } }, talk]), [talk]);
  const startOnly = calendar.render({ talk: { ...talk, data: { ...talk.data, starts: '2026-10-30T13:00:00+02:00', ends: undefined } } });
  assert.match(startOnly, /DTSTART:20261030T110000Z/);
  assert.doesNotMatch(startOnly, /DTEND|DURATION/);
});

test('a real talk renders a portrait, profile, biography, and registration link', async () => {
  const environment = new nunjucks.Environment(null, { autoescape: true });
  environment.addFilter('url', value => value);
  environment.addFilter('iso', value => new Date(value).toISOString());
  environment.addFilter('dateLabel', value => String(value));
  environment.addFilter('timeLabel', value => String(value));
  const template = await readFile('src/_includes/talk.njk', 'utf8');
  const html = environment.renderString(template, {
    title: 'Real event', topic: 'Cognitive science', speaker: 'Researcher <Name>',
    affiliation: 'University', description: 'An abstract summary', content: '<h2>Abstract</h2><p>Full abstract</p>',
    speakerPhoto: '/content/images/aaron-khodami.jpg', speakerBio: 'Research on attention & cognition.',
    speakerProfile: 'https://www.jyu.fi/en/people/aaron-khodami',
    speakerLinks: [{ label: 'Research profile', url: 'https://orcid.org/' }],
    registration: 'https://events.example.com/register?talk=1&lang=en', example: false,
    starts: '2026-11-26T14:00:00+02:00', ends: '2026-11-26T15:00:00+02:00',
    page: { fileSlug: 'real-event' }, site: { timezone: 'Europe/Helsinki' }
  });
  assert.match(html, /Register for the workshop/);
  assert.match(html, /href="https:\/\/events.example.com\/register\?talk=1&amp;lang=en"/);
  assert.match(html, /src="\/content\/images\/aaron-khodami.jpg"/);
  assert.match(html, /Research on attention &amp; cognition/);
  assert.match(html, /Researcher &lt;Name&gt;/);
  assert.match(html, /Speaker profile/);
  assert.match(html, /Research profile/);
  assert.match(html, /\/calendar\/real-event.ics/);
});
