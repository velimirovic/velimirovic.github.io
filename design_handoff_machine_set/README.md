# Handoff: Machine Set — personal portfolio (Marko Velimirović)

## Overview
A one-page personal portfolio for a backend / full-stack engineer looking for a first
engineering role, plus a per-project detail page. Audience: technical recruiters and
engineering leads who will spend under a minute on the page. Direction is bold editorial /
brutalist: everything set in a wide display monospace at large scale on an ivory ground,
cobalt used as full-bleed section bands and single-word accents, hard 2px rules, no cards,
no shadows, no gradients, no icons.

To be built in **Angular**, served as **static files**. No server-side rendering, no
runtime dependency on external services.

## About the Design Files
The two files in `reference/` are **design references written in HTML** — prototypes
showing intended look, scale and rhythm. They are not production code to copy. Recreate
them as Angular components using the project's own conventions (standalone components,
SCSS, a router). Where the HTML uses inline styles and `data-r` attributes to carry
responsive rules, use normal stylesheets and media queries instead.

Open either file in a browser to see it; resize to phone width to see the mobile layout.

## Fidelity
**High-fidelity.** Colors, typefaces, sizes and copy are final unless noted. Recreate the
type scale and the rules precisely — the design depends almost entirely on typographic
scale.

## Screens / Views

### 1. Home (`reference/home.dc.html`)
Single scrolling page. Vertical order:

1. **Header strip** — `padding: 22px 64px`, flex with `justify-content: space-between`.
   Left: `M. Velimirović`. Right: `Novi Sad · 45.2671 N`. Martian Mono 11px, uppercase,
   `letter-spacing: 0.02em`. Followed by a 2px `#111110` full-bleed rule.
2. **Hero** — `padding: 64px 64px 0`; CSS grid `1.7fr 0.9fr`, `gap: 52px`,
   `align-items: end`.
   - Left: `Backend / full-stack engineer` set as three lines
     (`Backend` / `/&nbsp;full-stack` / `engineer`). Martian Mono 800,
     `font-size: 6.6vw`, `line-height: 1.02`, `letter-spacing: -0.06em`, uppercase.
     The `/` glyph is cobalt `#1b2fd0`; the rest is `#111110`.
   - Right: Martian Mono 13px / `line-height: 1.7` — "B.Sc. Electrical & Computer
     Engineering — FTN, 2026 / Free from 01.09.2026" — then two links, `CV.pdf` and
     `mail`, 16px, `gap: 22px`.
3. **Section band — About.** A 2px rule, then a full-bleed `#1b2fd0` band with
   `#efece4` text: `padding: 14px 64px`, Martian Mono 12px uppercase,
   `letter-spacing: 0.06em`, content `About`. Then another 2px rule. This band pattern
   repeats for every section.
4. **About block** — `padding: 56px 64px 90px`; grid `1.15fr 1fr`, `gap: 52px`.
   - Left heading: `Twelve projects, one thesis` on three lines, Martian Mono 800
     `3.4vw`, `letter-spacing: -0.06em`, uppercase; `one thesis` in cobalt.
   - Right: a **spec sheet** — three rows, each a grid `100px 1fr` with `gap: 16px`,
     `padding: 12px 0`, `border-top: 1px solid #111110` (last row also
     `border-bottom`). Label column cobalt, value column `#111110`, both Martian Mono
     12px `line-height: 1.6`.
     Rows: `WRITES` → "C# · Node.js · Python · C++ · SQL";
     `RUNS ON` → "Docker · PostgreSQL · Redis · RabbitMQ";
     `SEEKING` → "First engineering role — from 01.09.2026".
5. **Section band — `01 / 12 — Thesis`.**
6. **Shelvio block** — same `1.15fr 1fr` grid as the about block.
   - Left: `Shelvio`, Martian Mono 800, `clamp(44px, 7.6vw, 96px)`,
     `line-height: 0.94`, `letter-spacing: -0.07em`, uppercase. Under it one line of
     IBM Plex Sans `clamp(20px, 2.2vw, 30px)`, `line-height: 1.25`,
     `max-width: 22ch`: "Films, series, books — and a recommender that argues its case."
   - Right: spec sheet — `SERVICES` → "5 behind one API gateway";
     `STACK` → "C# · Node.js · Python · PostgreSQL ×2 · Redis · RabbitMQ · GPT-4o mini";
     `RUN` → "docker compose up".
7. **Shelvio imagery** — one 16:9 plate at full content width (`padding: 40px 64px 0`),
   then a 3-up row of 16:9 plates, `gap: 16px`, `padding: 16px 64px 100px`. Real
   screenshots go here; in the reference they are striped grey placeholders with a
   monospace caption pinned bottom-left.
8. **Section band — `02 / 12 — Everything else`.**
9. **Project index** — eleven rows, each an `<a>`: grid `70px 1fr auto`, `gap: 20px`,
   `align-items: baseline`, `padding: 18px 0`, `border-bottom: 1px solid #c9c4b8`.
   Column 1 = cobalt two-digit number, Martian Mono 12px uppercase. Column 2 = project
   title, Martian Mono 700 `clamp(17px, 2.6vw, 34px)`, `letter-spacing: -0.05em`,
   mixed case. Column 3 = one short tag, Martian Mono 12px uppercase.
   Rows 02–12: Microservice platform / 7 services · Tour platform / live GPS ·
   Conference PWA / AI assistant · Geo-tagged video / web · Marketplace / live auctions ·
   Desktop app / WPF · Party card game / web · Game one / Unity · Game two / Unity ·
   Simulator one / OpenGL · C++ · Simulator two / OpenGL · C++.
   (Titles for 09–12 are placeholders — the real names go in.)
   Each row links to that project's detail route.
10. **Contact footer** — `padding: 96px 64px 120px`, grid `1.7fr 0.9fr`.
    Left: `Novi Sad` / `Serbia` (second line cobalt), Martian Mono 800 `5vw`,
    `letter-spacing: -0.06em`. Right: email and GitHub in Martian Mono 13px, then the
    `CV.pdf` / `mail` links in IBM Plex Sans 15px.

### 2. Project detail (`reference/project-page.dc.html`)
One route per project — the reference shows 03 / 12, Tour platform.

1. **Header strip** — left `← Index` (back to the index band on home), right `03 / 12`.
   Same 11px Martian Mono treatment, then a 2px rule.
2. **Title + spec sheet** — `padding: 56px 64px 0`, grid `1.15fr 1fr`, `gap: 52px`.
   Title Martian Mono 800 `6vw`, `line-height: 0.96`, `letter-spacing: -0.07em`,
   second word cobalt. One-line description in IBM Plex Sans
   `clamp(20px, 2.2vw, 30px)`, `max-width: 22ch`.
   Spec sheet has four rows here: `TRACKING`, `STACK`, `ROLE`, `SOURCE` (the last
   value is a link to the repo).
3. **Imagery** — one full-width 16:9 plate, then a 2-up row of 16:10 plates,
   `gap: 16px`. Projects with more screenshots extend this row; keep at most three
   plates below the lead image.
4. **Prev / next** — 2px rule, then `padding: 26px 64px 110px`, flex
   `space-between`. Left `← 02 Microservice platform` in `#111110`, right
   `04 Conference PWA →` in cobalt. Martian Mono 700
   `clamp(15px, 2.4vw, 26px)`, `letter-spacing: -0.04em`, uppercase, no underline.

## Interactions & Behavior
Deliberately minimal — no scroll animations, no reveal effects, no hover lifts, no
carousels.

- **Links**: default `color: #1b2fd0` with `border-bottom: 2px solid #1b2fd0`; on hover
  both go to `#111110`. Navigation links (index rows, `← Index`, prev/next) carry no
  underline and are `#111110`; on hover use cobalt.
- **Index rows**: the whole row is the click target; navigate to the project route.
- **Screenshots**: static. A lightbox would be an addition, not part of the design.
- **CV**: `CV.pdf` is a direct download of a static asset.
- **Responsive** (single breakpoint, `max-width: 820px`):
  - Page padding drops from `64px` to `20px`.
  - All `1.15fr 1fr` / `1.7fr 0.9fr` grids become one column; the right-hand block gets
    `margin-top: 24–30px`.
  - Spec-sheet rows become one column, `gap: 2px` — label above value.
  - Display type is re-sized, not just reflowed: hero `9.5vw`, about heading `8vw`,
    footer `10vw`, project-page title `11vw`. These were measured against 360 / 375 /
    414px viewports so no line clips — if you change the copy, re-check.
  - Index rows become grid `40px 1fr`, `gap: 0 14px`, `padding: 14px 0`; the tag moves
    to a second line under the title in `#6f695c`.
  - The 3-up and 2-up plate rows stack to one column.

## State Management
None beyond routing. A single static data structure of projects drives both the index and
the detail routes:

```ts
interface Project {
  number: string;          // "01" … "12"
  title: string;
  tag: string;             // short index tag, e.g. "live GPS"
  lead: string;            // one-line description
  specs: { label: string; value: string; href?: string }[];
  shots: { src: string; caption: string; ratio: '16/9' | '16/10' | '4/3' }[];
}
```

## Design Tokens

Colors
- `#efece4` — page ground (ivory)
- `#111110` — text and 2px rules
- `#1b2fd0` — cobalt: section bands, accent words, spec labels, links
- `#6f695c` — placeholder captions, mobile index tags
- `#c9c4b8` — hairline under index rows
- `#dbd7cc` / `#d3cec2` — the two stripes of the screenshot placeholder
- `#efece4` — text on the cobalt bands

Typography
- Display and all label text: **Martian Mono** (Google Fonts), weights 400 / 700 / 800.
  Chosen because it is wide and geometric, built for display sizes, and reads as
  engineering documentation rather than marketing.
- Running text: **IBM Plex Sans** (Google Fonts), 400 / 500 — used only for the few real
  sentences.
- Display sizes are viewport-relative (`3.4vw`–`6.6vw` desktop) with tight negative
  tracking (`-0.06em` / `-0.07em`) and `line-height` 0.94–1.06.
- Small mono text: 11–13px, `letter-spacing: 0.02–0.06em`, uppercase.
- Body: 16–18px, or `clamp(20px, 2.2vw, 30px)` for the one-line project descriptions.

Spacing
- Page gutter 64px desktop / 20px mobile.
- Section rhythm: 52–66px between blocks; 90–120px around the footer.
- Grid gaps: 52px between the two columns, 16px between plates.

Rules, radius, shadows
- Section rules 2px `#111110`; spec-sheet and index rules 1px.
- `border-radius: 0` everywhere. No shadows. No gradients except the striped placeholder
  fill.

## Assets
- **Screenshots** — supplied by Marko: four for Shelvio, 2–5 for each of the other eleven
  projects. In the reference they are striped grey blocks at the correct aspect ratio with
  a monospace caption. Export at 2× the plate width and treat the aspect ratios above as
  fixed (crop rather than letterbox).
- **CV** — a static PDF.
- **Fonts** — Martian Mono and IBM Plex Sans. For a static Angular build, self-host them
  (`@font-face`, woff2) rather than linking Google Fonts, so the page has no runtime
  dependency on an external service. Ship only the weights listed above.
- **No icons, no images beyond the screenshots.** The `←` / `→` are text characters.

## Files
- `reference/home.dc.html` — the home page.
- `reference/project-page.dc.html` — the project detail page.

Both are self-contained: open either directly in a browser. They load their two fonts from
Google Fonts; everything else is inline.

## Notes for implementation
- The direction rests on scale contrast — very large mono display type against very small
  mono labels, with a lot of empty ivory between. If in doubt, make the big things bigger
  and delete something rather than adding.
- Do not introduce cards, rounded corners, chips or pills for the tech stacks, drop
  shadows, gradient backgrounds, or scroll-reveal animations. Their absence is the design.
- Copy is deliberately short and declarative. Do not expand it into paragraphs.
