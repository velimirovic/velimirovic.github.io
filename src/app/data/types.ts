/** Content model. Everything the site renders comes from src/app/data. */

export interface SpecLink {
  label: string;
  href: string;
}

/**
 * One row of a spec sheet: a cobalt label on the left, the value on the right.
 * A row carries either plain `value` text or one or more `links`, never both.
 */
export interface SpecRow {
  label: string;
  value?: string;
  links?: SpecLink[];
}

export interface Project {
  /** Route segment. */
  id: string;
  /** Two-digit index used in the band, the index row and the header strip. */
  number: string;
  /**
   * Title split across lines. The last line is set in cobalt when there is more than one,
   * which is the two-line treatment the design uses for every project title.
   */
  titleLines: string[];
  /** Short lowercase tag shown at the right of an index row. */
  tag: string;
  /** The single sentence under the title. Kept to about 22 characters per line. */
  lead: string;
  /** Body copy on the detail page: two or three short paragraphs. */
  description: string[];
  specs: SpecRow[];
  /** Alt text per plate, in order. */
  captions: string[];
}
