import { SpecRow } from './types';

/** ISO date of birth. The About line derives the age from it so it never goes stale. */
const BORN = '2003-12-21';

/** Whole years elapsed, counting the birthday rather than just the year difference. */
export function ageFrom(iso: string, today = new Date()): number {
  const born = new Date(iso);
  let age = today.getFullYear() - born.getFullYear();
  const beforeBirthday =
    today.getMonth() < born.getMonth() ||
    (today.getMonth() === born.getMonth() && today.getDate() < born.getDate());
  if (beforeBirthday) age -= 1;
  return age;
}

/**
 * A Gmail compose URL rather than a `mailto:`.
 *
 * `mailto:` hands off to whatever the operating system has registered, which on a desktop
 * with no mail client set up does nothing at all. This opens Gmail's compose window in the
 * browser, and on a phone the Gmail app picks up its own domain and opens there instead.
 */
export function gmailCompose(to: string, subject = '', body = ''): string {
  const params = new URLSearchParams({ view: 'cm', fs: '1', to, su: subject, body });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

/**
 * Home page copy and contact details.
 *
 * The strings here are meant to stay short. The whole direction depends on very little text
 * set very large — lengthening any of these breaks the line counts the type scale was
 * measured against.
 */
export const site = {
  name: 'Marko Velimirović',
  /** Split for the About heading; the surname is set in cobalt. */
  nameLines: ['Marko', 'Velimirović'],
  /** Header strip, left. */
  mark: 'M. Velimirović',
  /** Header strip, right. */
  place: 'Novi Sad, Serbia',

  born: BORN,
  age: ageFrom(BORN),

  /** Hero. The cobalt slash is appended to the first line by the template. */
  heroLines: ['Backend', 'full-stack', 'engineer'],

  // 3 — a date on its own read like a deadline; this says the same thing as a sentence.
  heroMeta: ['B.Sc. Electrical & Computer', 'Engineering — FTN, 2026', 'Looking for my first role'],

  /**
   * About the person, not the work — the projects are already on the page and do not need
   * summarising twice. Two paragraphs is the ceiling here; the block sits beside a portrait
   * and a spec sheet, and anything longer makes the section the tallest thing on the page.
   */
  aboutText: [
    'I am from Novi Sad and I have just finished a degree in electrical and computer ' +
      'engineering at the Faculty of Technical Sciences. Before that, four years at the ' +
      'Mihajlo Pupin technical school, where I found out that a computer is something you ' +
      'can take apart rather than only use.',
    'I work in an organised way and I finish what I take on. Most of my projects were team ' +
      'work, splitting a system into parts and keeping them fitting together; a few I built ' +
      'alone from the first commit to the last. I am comfortable either way, and I would ' +
      'rather ask an obvious question early than guess and rebuild later.',
  ],

  // Six rows, not eight. Education is one line rather than two, and the availability date is
  // already in the hero — repeating it just made the block taller on a phone.
  aboutSpecs: [
    { label: 'WORKS IN', value: 'C# · Java · Go · Python · C++' },
    { label: 'RUNS ON', value: 'Docker · PostgreSQL · Redis · RabbitMQ' },
    { label: 'FRONT END', value: 'Angular · React · TypeScript' },
    { label: 'STUDIED', value: 'B.Sc. Electrical & Computer Eng., FTN 2026' },
    { label: 'SPEAKS', value: 'Serbian · English' },
    { label: 'MENSA', value: 'Member since 17' },
  ] satisfies SpecRow[],

  contactHeading: {
    lines: ['Say'],
    accent: 'hello',
  },

  footer: {
    lines: ['Novi Sad'],
    accent: 'Serbia',
  },

  email: 'velimirovitsh@gmail.com',
  github: 'https://github.com/velimirovic',
  githubLabel: 'github.com/velimirovic',
  linkedin: 'https://www.linkedin.com/in/velimirovic/',
  linkedinLabel: 'linkedin.com/in/velimirovic',

  cv: 'assets/Marko_Velimirovic_CV.pdf',
  avatar: 'assets/img/marko.webp',

  site: 'https://velimirovic.github.io',
};
