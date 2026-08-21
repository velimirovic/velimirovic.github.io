/**
 * Reads the project ids straight out of the Angular data file, so the sitemap can never
 * list a route that does not exist (or miss one that does). Parsed rather than imported
 * because the data file is TypeScript and these scripts run on bare Node.
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(join(root, 'src', 'app', 'data', 'projects.data.ts'), 'utf8');

export const projects = [...source.matchAll(/^\s{4}id: '([^']+)',$/gm)].map(([, id]) => id);

if (!projects.length) {
  throw new Error('No project ids found in src/app/data/projects.data.ts');
}
