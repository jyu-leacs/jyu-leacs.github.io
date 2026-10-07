import site from './_data/site.js';
const escape = value => String(value || '').replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
const stamp = date => new Date(date).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
// RFC 5545 folding: never split a multi-byte UTF-8 character.
function fold(line) {
  let result = '', current = '', size = 0;
  for (const character of line) {
    const bytes = Buffer.byteLength(character);
    if (size + bytes > 75) { result += current + '\r\n'; current = ' '; size = 1; }
    current += character; size += bytes;
  }
  return result + current;
}
export default class {
  data() {
    return {
      pagination: { data: 'collections.talks', size: 1, alias: 'talk', before: talks => talks.filter(t => !t.data.example && t.data.starts) },
      permalink: data => `/calendar/${data.talk.page.fileSlug}.ics`,
      eleventyExcludeFromCollections: true
    };
  }
  render({ talk }) {
    const data = talk.data;
    const url = new URL(`${site.basePath.replace(/\/$/, '')}${talk.url}`, site.url).href;
    return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//LEACS//Seminars//EN','CALSCALE:GREGORIAN','BEGIN:VEVENT',`UID:${url}`,`DTSTAMP:${stamp(data.date || talk.date)}`,`DTSTART:${stamp(data.starts)}`,...(data.ends ? [`DTEND:${stamp(data.ends)}`] : []),`SUMMARY:${escape(data.title)}`,`DESCRIPTION:${escape(data.description + (data.meetingUrl ? '\nJoin: ' + data.meetingUrl : ''))}`,`LOCATION:${escape(data.venue)}`,`URL:${url}`,'END:VEVENT','END:VCALENDAR'].map(fold).join('\r\n') + '\r\n';
  }
}
