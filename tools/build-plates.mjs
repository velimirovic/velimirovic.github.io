/**
 * Turns raw screenshots into the fixed-ratio "plates" the design is built from.
 *
 * The design calls for 16:9 and 16:10 plates and says to crop rather than letterbox. That
 * works for the landscape captures, but ten of the screenshots are portrait phone shots
 * (roughly 1:2) — cropping one of those to 16:9 leaves a useless horizontal sliver. So
 * portrait shots are instead composited two or three abreast on the page ground, which
 * fills a real 16:9 plate and keeps the whole UI readable.
 *
 * Reads assets-src/projects/<id>/*.png|jpg, writes
 * public/assets/projects/<id>/<n>-16x9.webp and <n>-16x10.webp, plus a manifest listing
 * how many plates each project ended up with.
 *
 * Run with `npm run plates`.
 */
import { readdir, mkdir, writeFile, readFile } from 'node:fs/promises';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'assets-src', 'projects');
const outRoot = join(root, 'public', 'assets', 'projects');

/** Page ground from the design tokens — composited plates sit on it seamlessly. */
const GROUND = { r: 0xef, g: 0xec, b: 0xe4, alpha: 1 };

const PLATE_WIDTH = 1600;
/** Second, smaller rendition. The 3-up row on the home page renders around 300px wide. */
const NARROW_WIDTH = 800;
const RATIOS = { '16x9': 16 / 9, '16x10': 16 / 10 };
const QUALITY = 82;

/** Below this the image is treated as a phone capture and grouped with its neighbours. */
const PORTRAIT_MAX_RATIO = 1.0;
/** How many phone captures go side by side on one plate. */
const PHONES_PER_PLATE = 3;

const isImage = (file) => ['.png', '.jpg', '.jpeg'].includes(extname(file).toLowerCase());

/** Sort 2.png before 10.png, which a plain string sort would not. */
const naturalSort = (a, b) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

/**
 * Crops one image to fill the target ratio exactly. `attention` keeps the interesting part
 * of a UI capture in frame rather than blindly taking the centre.
 */
async function cropPlate(buffer, ratio) {
  const height = Math.round(PLATE_WIDTH / ratio);
  return sharp(buffer)
    .resize(PLATE_WIDTH, height, { fit: 'cover', position: sharp.strategy.attention })
    .webp({ quality: QUALITY })
    .toBuffer();
}

/**
 * Lays several portrait captures side by side on the page ground, scaled to a common
 * height, and returns a plate at the target ratio.
 */
async function composePhonePlate(buffers, ratio) {
  const height = Math.round(PLATE_WIDTH / ratio);
  const gutter = Math.round(PLATE_WIDTH * 0.025);
  const margin = Math.round(height * 0.06);
  const phoneHeight = height - margin * 2;

  const phones = [];
  for (const buffer of buffers) {
    const resized = sharp(buffer).resize({ height: phoneHeight, fit: 'inside' });
    const data = await resized.webp({ quality: QUALITY }).toBuffer();
    const meta = await sharp(data).metadata();
    phones.push({ data, width: meta.width ?? 0, height: meta.height ?? 0 });
  }

  const totalWidth =
    phones.reduce((sum, p) => sum + p.width, 0) + gutter * (phones.length - 1);

  // If the row is wider than the plate, scale the whole row down to fit.
  const scale = totalWidth > PLATE_WIDTH - margin * 2 ? (PLATE_WIDTH - margin * 2) / totalWidth : 1;

  const scaled = [];
  for (const phone of phones) {
    const width = Math.round(phone.width * scale);
    const h = Math.round(phone.height * scale);
    const data =
      scale === 1 ? phone.data : await sharp(phone.data).resize(width, h).webp({ quality: QUALITY }).toBuffer();
    scaled.push({ data, width, height: h });
  }

  const rowWidth =
    scaled.reduce((sum, p) => sum + p.width, 0) + Math.round(gutter * scale) * (scaled.length - 1);
  let left = Math.round((PLATE_WIDTH - rowWidth) / 2);

  const composites = scaled.map((phone) => {
    const item = {
      input: phone.data,
      left,
      top: Math.round((height - phone.height) / 2),
    };
    left += phone.width + Math.round(gutter * scale);
    return item;
  });

  return sharp({
    create: { width: PLATE_WIDTH, height, channels: 4, background: GROUND },
  })
    .composite(composites)
    .webp({ quality: QUALITY })
    .toBuffer();
}

const manifest = {};
let plateCount = 0;

for (const id of (await readdir(source, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)) {
  const dir = join(source, id);
  const files = (await readdir(dir)).filter(isImage).sort(naturalSort);
  if (!files.length) continue;

  // Split into landscape captures and runs of portrait phone captures, preserving order.
  const groups = [];
  let phoneRun = [];

  for (const file of files) {
    const buffer = await readFile(join(dir, file));
    const meta = await sharp(buffer).metadata();
    const ratio = (meta.width ?? 1) / (meta.height ?? 1);

    if (ratio <= PORTRAIT_MAX_RATIO) {
      phoneRun.push(buffer);
      if (phoneRun.length === PHONES_PER_PLATE) {
        groups.push({ kind: 'phones', buffers: phoneRun });
        phoneRun = [];
      }
    } else {
      if (phoneRun.length) {
        groups.push({ kind: 'phones', buffers: phoneRun });
        phoneRun = [];
      }
      groups.push({ kind: 'single', buffer });
    }
  }
  if (phoneRun.length) groups.push({ kind: 'phones', buffers: phoneRun });

  const outDir = join(outRoot, id);
  await mkdir(outDir, { recursive: true });

  for (const [index, group] of groups.entries()) {
    for (const [name, ratio] of Object.entries(RATIOS)) {
      const plate =
        group.kind === 'phones'
          ? await composePhonePlate(group.buffers, ratio)
          : await cropPlate(group.buffer, ratio);
      await writeFile(join(outDir, `${index + 1}-${name}.webp`), plate);
      plateCount++;

      // A narrow rendition so the 3-up and 2-up rows do not pull down full-width images.
      const narrow = await sharp(plate)
        .resize({ width: NARROW_WIDTH })
        .webp({ quality: QUALITY })
        .toBuffer();
      await writeFile(join(outDir, `${index + 1}-${name}-800.webp`), narrow);
      plateCount++;
    }
  }

  manifest[id] = groups.length;
  console.log(`${id.padEnd(16)} ${files.length} shots -> ${groups.length} plates`);
}

// Emitted as TypeScript rather than JSON so the project data cannot drift out of step with
// what is actually on disk — the components read these counts directly.
const generated = [
  '// Generated by tools/build-plates.mjs — do not edit by hand.',
  '// Run `npm run plates` after changing anything in assets-src/projects.',
  '',
  'export const plateCounts: Record<string, number> = {',
  ...Object.entries(manifest)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([id, count]) => `  '${id}': ${count},`),
  '};',
  '',
].join('\n');

await writeFile(join(root, 'src', 'app', 'data', 'plates.generated.ts'), generated, 'utf8');

console.log(`\nWrote ${plateCount} plate files and src/app/data/plates.generated.ts.`);
