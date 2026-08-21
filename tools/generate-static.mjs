/**
 * Generates the files that are derived from content rather than authored: the portrait,
 * the social share card, favicons, sitemap.xml and robots.txt. Also copies the CV.
 *
 * Run with `npm run static`; the build script runs it first, so a redeploy always ships a
 * sitemap matching the current project list.
 */
import { writeFile, mkdir, copyFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { projects } from './project-ids.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');
const assetsDir = join(publicDir, 'assets');

const SITE = 'https://velimirovic.github.io';

// Design tokens, mirrored from src/styles/_tokens.scss.
const GROUND = '#efece4';
const INK = '#111110';
const COBALT = '#1b2fd0';

await mkdir(join(assetsDir, 'img'), { recursive: true });

// ── Portrait ─────────────────────────────────────────────────────
// Cropped to 4:5 around the face: the source is 3:2, which reads as a snapshot, while a
// tall crop reads as a portrait plate and fills the About column.
for (const [suffix, width] of [
  ['', 900],
  ['-500', 500],
]) {
  await sharp(join(root, 'assets-src', 'img', 'marko-avatar.png'))
    .resize(width, Math.round((width * 5) / 4), { fit: 'cover', position: 'top' })
    // The source has a transparent background; flattening onto the page ground makes the
    // figure read as cut out and placed straight on the paper.
    .flatten({ background: GROUND })
    .webp({ quality: 84 })
    .toFile(join(assetsDir, 'img', `marko${suffix}.webp`));
}

// ── CV ───────────────────────────────────────────────────────────
// The PDF is generated from cv/cv.html by `npm run cv`, which also drops a copy here. This
// copy is the safety net for a clean checkout; it must read from cv/, not from anywhere
// else, or a stale file silently overwrites the current one.
await copyFile(
  join(root, 'cv', 'Marko_Velimirovic_CV.pdf'),
  join(assetsDir, 'Marko_Velimirovic_CV.pdf'),
);

// ── Social share card ────────────────────────────────────────────
// 1200×630 is what LinkedIn, Slack and X crop to. Same ivory ground, same cobalt slash and
// same wide mono as the page, so a shared link looks like the site it opens.
const card = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${GROUND}"/>
  <rect x="0" y="0" width="1200" height="2" fill="${INK}"/>

  <text x="64" y="70" font-family="monospace" font-size="20" fill="${INK}"
        letter-spacing="1">M. VELIMIROVIĆ</text>
  <text x="1136" y="70" font-family="monospace" font-size="20" fill="${INK}"
        letter-spacing="1" text-anchor="end">NOVI SAD · 45.2671 N</text>
  <rect x="0" y="96" width="1200" height="2" fill="${INK}"/>

  <text x="58" y="268" font-family="monospace" font-size="112" font-weight="bold"
        fill="${INK}" letter-spacing="-6">BACKEND</text>
  <text x="58" y="380" font-family="monospace" font-size="112" font-weight="bold"
        letter-spacing="-6"><tspan fill="${COBALT}">/</tspan><tspan fill="${INK}"> FULL-STACK</tspan></text>
  <text x="58" y="492" font-family="monospace" font-size="112" font-weight="bold"
        fill="${INK}" letter-spacing="-6">ENGINEER</text>

  <rect x="0" y="556" width="1200" height="2" fill="${INK}"/>
  <rect x="0" y="558" width="1200" height="72" fill="${COBALT}"/>
  <text x="64" y="603" font-family="monospace" font-size="21" fill="${GROUND}"
        letter-spacing="2">TWELVE PROJECTS, ONE THESIS</text>
  <text x="1136" y="603" font-family="monospace" font-size="21" fill="${GROUND}"
        letter-spacing="2" text-anchor="end">VELIMIROVIC.GITHUB.IO</text>
</svg>`;

await sharp(Buffer.from(card)).png().toFile(join(assetsDir, 'og-card.png'));

// ── Favicons ─────────────────────────────────────────────────────
// The cobalt slash from the hero, on the page ground.
const mark = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="${GROUND}"/>
  <text x="32" y="46" font-family="monospace" font-size="52" font-weight="bold"
        fill="${COBALT}" text-anchor="middle">/</text>
</svg>`;

for (const size of [32, 180, 512]) {
  await sharp(Buffer.from(mark(size))).png().toFile(join(assetsDir, `icon-${size}.png`));
}

// ── sitemap.xml ──────────────────────────────────────────────────
const today = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: SITE, priority: '1.0' },
  ...projects.map((id) => ({ loc: `${SITE}/projects/${id}`, priority: '0.8' })),
];

await writeFile(
  join(publicDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, priority }) =>
      `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`,
  )
  .join('\n')}
</urlset>
`,
  'utf8',
);

// ── robots.txt ───────────────────────────────────────────────────
await writeFile(
  join(publicDir, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`,
  'utf8',
);

console.log(
  `Wrote portrait, CV, og-card.png, 3 icons, sitemap.xml (${urls.length} urls) and robots.txt.`,
);
