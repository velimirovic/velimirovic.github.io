/**
 * Renders cv/cv.html to a print-ready PDF using the installed Chrome, then copies it into
 * public/assets so the portfolio and the CV never drift apart.
 *
 * Chrome is used rather than a PDF library because the CV is laid out in CSS and Chrome is
 * the same engine that renders it in a browser — what you preview is what gets printed. The
 * text layer stays selectable, which is what applicant tracking systems parse.
 *
 * Run with `npm run cv`.
 */
import { access, copyFile, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { join, dirname } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const run = promisify(execFile);

/** Date of birth, mirrored from src/app/data/site.data.ts. */
const BORN = '2003-12-21';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const source = join(root, 'cv', 'cv.html');
/** Rendered from `source` with the age filled in; deleted once Chrome is done with it. */
const staged = join(root, 'cv', '.cv.staged.html');
const output = join(root, 'cv', 'Marko_Velimirovic_CV.pdf');
const published = join(root, 'public', 'assets', 'Marko_Velimirovic_CV.pdf');

const CANDIDATES = [
  process.env['CHROME_PATH'],
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

async function findBrowser() {
  for (const path of CANDIDATES) {
    try {
      await access(path);
      return path;
    } catch {
      // Try the next one.
    }
  }
  throw new Error(
    `No Chrome or Edge found. Set CHROME_PATH to the executable, or open cv/cv.html and print to PDF.`,
  );
}

/** Whole years elapsed, counting the birthday — the same rule the site uses. */
function ageFrom(iso, today = new Date()) {
  const born = new Date(iso);
  let age = today.getFullYear() - born.getFullYear();
  const beforeBirthday =
    today.getMonth() < born.getMonth() ||
    (today.getMonth() === born.getMonth() && today.getDate() < born.getDate());
  return beforeBirthday ? age - 1 : age;
}

// The age is written into the HTML between markers rather than typed in, so it cannot go
// stale between now and the next birthday.
const html = await readFile(source, 'utf8');
const age = ageFrom(BORN);
const filled = html.replace(/<!--AGE-->.*?<!--\/AGE-->/s, `<!--AGE-->${age}<!--/AGE-->`);

if (filled === html && !html.includes(`<!--AGE-->${age}<!--/AGE-->`)) {
  throw new Error('Could not find the <!--AGE--> marker in cv/cv.html');
}

await writeFile(staged, filled, 'utf8');

const browser = await findBrowser();

await run(browser, [
  '--headless',
  '--disable-gpu',
  // The page sets its own A4 size and margins in CSS, so Chrome must not add its own.
  '--no-pdf-header-footer',
  `--print-to-pdf=${output}`,
  pathToFileURL(staged).href,
]);

await rm(staged, { force: true });

await mkdir(dirname(published), { recursive: true });
await copyFile(output, published);

const { size } = await stat(output);

// One page is the target for a CV with under three years of experience, and it is easy to
// blow past it by a line or two without noticing. Count the page objects in the output
// rather than trusting a visual check.
const pdf = await readFile(output, 'latin1');
const pages = (pdf.match(/\/Type\s*\/Page[^s]/g) ?? []).length;

console.log(
  `Wrote cv/Marko_Velimirovic_CV.pdf (${Math.round(size / 1024)} KB, ${pages} page${pages === 1 ? '' : 's'}, age ${age}) and copied it to public/assets.`,
);

if (pages > 1) {
  console.warn(
    `
  Warning: the CV spilled onto ${pages} pages. Cut a bullet or a skills line in cv/cv.html.`,
  );
  process.exitCode = 1;
}
