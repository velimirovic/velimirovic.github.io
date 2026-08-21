# velimirovic.github.io

Personal portfolio. Angular 21, prerendered to static HTML, deployed to GitHub Pages by
GitHub Actions on every push to `main`.

Built to the design in `design_handoff_machine_set/` — bold editorial, everything set in
Martian Mono on an ivory ground with cobalt bands, no cards, no shadows, no scroll
animations. That handoff is the source of truth for the look; this README covers the
implementation.

---

## Running it

```bash
npm install
npm start
```

Then open http://localhost:4200.

| Script | What it does |
| --- | --- |
| `npm start` | Dev server with hot reload |
| `npm run build` | Generates static assets, then prerenders every route into `dist/portfolio/browser` |
| `npm run plates` | Rebuilds the screenshot plates from `assets-src/` |
| `npm run fonts` | Re-downloads and self-hosts Martian Mono and IBM Plex Sans |
| `npm run static` | Regenerates the portrait, share card, favicons, `sitemap.xml` and `robots.txt` |
| `npm run cv` | Renders `cv/cv.html` to a one-page PDF and copies it into `public/assets` |

`npm run build` runs `static` automatically. `plates` and `fonts` are separate because they
only need to run when the screenshots or the typefaces change.

---

## Where the content lives

Nothing is hardcoded in a template. All copy comes from `src/app/data/`:

| File | Holds |
| --- | --- |
| `site.data.ts` | Header strip, hero, about spec sheet, footer, contact details |
| `projects.data.ts` | All twelve entries, including the thesis |
| `plates.generated.ts` | Plate counts, written by `npm run plates` — do not edit |

The strings are deliberately short. The design depends on very little text set very large,
and the type scale was measured against these exact line counts — lengthening a hero line
or an index title can make it wrap where it should not.

### Adding a project

1. Put the screenshots in `assets-src/projects/<project-id>/` named `1.png`, `2.png`, …
2. Run `npm run plates`
3. Append an entry to `projects.data.ts` with the same `id`, the next `number`, and a
   `captions` entry per plate

The route, the detail page, the prerendering, the sitemap and the prev/next links all
follow from that. Renumber the entries after it if you insert one in the middle.

### Screenshots and plate ratios

The design uses fixed 16:9 and 16:10 plates and crops rather than letterboxes. Landscape
captures are cropped to fit. Portrait phone captures — cropping one of those to 16:9 would
leave a useless sliver — are instead composited two or three abreast on the page ground,
which fills a real plate and keeps the whole UI readable. `tools/build-plates.mjs` decides
which treatment an image gets from its aspect ratio, so just drop files in and re-run.

Two renditions are written per plate (800px and 1600px) and picked with `sizes`, so the
3-up row does not download full-width images.

---

## The CV

`cv/cv.html` is the source; `npm run cv` renders it to `cv/Marko_Velimirovic_CV.pdf` with the
installed Chrome and copies it into `public/assets`, where the site links it. Edit the HTML,
re-run, commit both.

It is deliberately plain — single column, no tables, no graphics, standard section headers —
because applicant tracking systems read a PDF's text layer linearly and drop anything laid
out side by side. The only nod to the portfolio is the cobalt.

Two constraints worth keeping:

- **One page.** `npm run cv` counts the pages and fails the command if it spills to two. The
  usable height is 281mm; if you add a bullet, take one out.
- **Links stay as text.** The portfolio URL sits on its own line in the contact block, not
  inside a button or an icon, so a parser can find it.

After the thesis defence, drop the mentor note if you prefer, and change the education end
date if it moves.

---

## Deploying

Push to `main`. That is the whole process.

First-time setup on a new repository:

1. Create a repo named `velimirovic.github.io` — the name has to match the username
   exactly for the site to be served from the domain root
2. Push this project to `main`
3. In **Settings → Pages**, set **Source** to **GitHub Actions**

Because the site is served from the domain root, `<base href="/">` in `src/index.html` is
correct as is, and the self-hosted fonts are referenced as `/fonts/…`. Deploying to a
project page such as `username.github.io/portfolio` instead would need `--base-href` on the
build **and** a change to those font URLs in `tools/fetch-fonts.mjs`.

---

## How it is put together

```
src/app/
  core/         SEO service
  data/         All site content
  components/   Header strip, section band, spec sheet, plate
  pages/        Home and the project detail route
tools/          Font, plate and static-asset generation
assets-src/     Original full-resolution screenshots, source of truth
public/         Everything served as-is: fonts, generated plates, CV
```

Routes are prerendered at build time, so every page ships real HTML. That matters less for
Google, which runs JavaScript, than it does for LinkedIn, Slack and WhatsApp link previews,
which do not.

The fonts are self-hosted rather than linked from Google Fonts, as the handoff asks — the
deployed page makes no third-party requests at all. Both families are variable fonts, so
each subset is stored once and declared with a weight range: four files, 124 KB total.
