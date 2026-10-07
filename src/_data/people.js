import { readFileSync } from 'node:fs';
export default JSON.parse(readFileSync(new URL('../../content/people.json', import.meta.url), 'utf8'));
